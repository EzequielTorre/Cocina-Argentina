import { createClient } from "@supabase/supabase-js";
import recipesData from "../components/data/recipes.json";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Falta configurar VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env",
  );
}

/**
 * Cliente de Supabase inicializado
 * Usa características de autenticación y acceso a la base de datos
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Adaptador para normalizar una fila de receta al mismo shape
 * @param {Object} row - Fila original proveniente de Supabase
 * @returns {Object} Objeto receta con shape estandarizado
 */
const normalizeRecipe = (row = {}) => {
  const instructionsRaw =
    row.instruccions || row.instrucciones || row.instructions || "";
  let ingredientsRaw = row.ingredientes || row.ingredients || "";

  // si es cadena, dividimos por saltos de línea para obtener array
  if (typeof ingredientsRaw === "string") {
    ingredientsRaw = ingredientsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return {
    id: row.id ?? null,
    title: row.title ?? "",
    description: row.descriptions ?? row.description ?? "",
    instructions: Array.isArray(instructionsRaw)
      ? instructionsRaw.join("\n")
      : (instructionsRaw ?? ""),
    category: row.category ?? "",
    time: row.time ?? null,
    difficulty: row.difficulty ?? "",
    image: row.image ?? "",
    ingredients: Array.isArray(ingredientsRaw) ? ingredientsRaw : [],
  };
};

/**
 * Función para obtener todas las recetas
 * @returns {Promise<Array>} Array con todas las recetas
 */
export const getRecipes = async () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Configuración de Supabase incompleta");
    }
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data || []).map(normalizeRecipe);
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    return []; // Devolver array vacío en lugar de lanzar error para evitar 'Uncaught in promise'
  }
};

/**
 * Función para obtener una receta por ID
 * @param {number|string} id - ID de la receta
 * @returns {Promise<Object>} La receta encontrada
 */
export const getRecipeById = async (id) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Configuración de Supabase incompleta");
    }
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? normalizeRecipe(data) : null;
  } catch (error) {
    console.error(`Error al obtener receta ${id}:`, error);
    return null; // Devolver null en lugar de lanzar error
  }
};

/**
 * Función para crear una nueva receta (admin only)
 * @param {Object} recipe - Objeto con datos de la receta
 * @param {Object} options - Opciones adicionales (userId, pending)
 * @returns {Promise<Object>} La receta creada
 */
export const createRecipe = async (recipe, { userId, pending } = {}) => {
  // si recibimos array en ingredients, lo convertimos a texto
  const payload = { ...recipe };
  if (Array.isArray(payload.ingredients)) {
    payload.ingredients = payload.ingredients.join("\n");
  }

  try {
    // Insertamos sólo los campos que el usuario ha completado.
    // No añadimos aquí "created_by" ni "status" para evitar errores
    // si esas columnas no existen en la tabla.
    const { data, error } = await supabase
      .from("recipes")
      .insert([payload])
      .single();

    if (error) throw error;

    // Si la inserción fue exitosa y tenemos campos adicionales,
    // hacemos un UPDATE separado y silencioso.
    if (data && data.id && (userId || pending)) {
      const updates = {};
      if (userId) updates.created_by = userId;
      if (pending) updates.status = pending;
      try {
        await supabase
          .from("recipes")
          .update(updates, { returning: "minimal" })
          .eq("id", data.id);
      } catch (err) {
        // Si la tabla no tiene esos campos, no nos interesa.
        console.warn("No se pudieron aplicar campos opcionales:", err.message);
      }
    }

    return data;
  } catch (error) {
    console.error("Error al crear receta:", error);
    console.debug("Payload enviado a Supabase (sin extras):", recipe);
    throw error;
  }
};

/**
 * Función para actualizar una receta (admin only)
 * @param {number|string} id - ID de la receta
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} La receta actualizada
 */
export const updateRecipe = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error al actualizar receta ${id}:`, error);
    throw error;
  }
};

/**
 * Función para eliminar una receta (admin only)
 * @param {number|string} id - ID de la receta
 * @returns {Promise<void>}
 */
export const deleteRecipe = async (id) => {
  try {
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error al eliminar receta ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda o actualiza un rating de un usuario para una receta
 * Requiere tabla "ratings" en Supabase con columnas:
 * - id (uuid)
 * - user_id (text)
 * - recipe_id (integer)
 * - value (integer)
 *
 * Nota: La restricción única debe ser (user_id, recipe_id), pero si solo existe
 * en user_id, usamos el patrón UPDATE + INSERT (solo si no hay filas afectadas)
 */
export const upsertRating = async ({ userId, recipeId, value }) => {
  if (!userId || !recipeId) return;

  const recipeNum = parseInt(recipeId);
  if (isNaN(recipeNum)) {
    console.error("upsertRating: recipeId inválido", recipeId);
    return { success: false, error: new Error("recipeId inválido") };
  }

  // asegurarnos de que la receta esté presente en la tabla
  const recipeToEnsure = recipesData.find((r) => r.id === recipeNum);
  if (recipeToEnsure) {
    // eslint-disable-next-line no-use-before-define
    await ensureRecipes([recipeToEnsure]);
  }

  try {
    // Primero intentar UPDATE
    const { error: updateError, count } = await supabase
      .from("ratings")
      .update({ value })
      .eq("user_id", userId)
      .eq("recipe_id", recipeNum);

    if (updateError) {
      return { success: false, error: updateError };
    }

    // Si no se actualizó ninguna fila, insertar nuevo registro
    if (count === 0) {
      const { error: insertError } = await supabase.from("ratings").insert({
        user_id: userId,
        recipe_id: recipeId,
        value,
      });

      if (insertError) {
        return { success: false, error: insertError };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error al guardar rating:", error);
    return { success: false, error };
  }
};

/**
 * Obtiene información agregada de rating para una receta
 * - average: promedio
 * - count: cantidad de votos
 * - userRating: rating del usuario actual (si se pasa userId)
 */
export const getRecipeRatingStats = async ({ recipeId, userId }) => {
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("value, user_id")
      .eq("recipe_id", recipeId);

    if (error) throw error;

    const rows = data || [];
    if (rows.length === 0) {
      return { average: 0, count: 0, userRating: 0 };
    }

    const sum = rows.reduce((acc, r) => acc + (r.value || 0), 0);
    const count = rows.length;
    const average = sum / count;
    const userRating = userId
      ? rows.find((r) => r.user_id === userId)?.value || 0
      : 0;

    return { average, count, userRating };
  } catch (error) {
    console.error("Error al obtener stats de rating:", error);
    return { average: 0, count: 0, userRating: 0 };
  }
};

// Sincroniza recetas locales con la tabla de Supabase.
export const ensureRecipes = async (recipes) => {
  if (!Array.isArray(recipes) || recipes.length === 0) return;
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from("recipes")
      .select("id");
    if (fetchErr) throw fetchErr;

    const existingIds = new Set((existing || []).map((r) => r.id));
    const toInsert = recipes
      .filter((r) => !existingIds.has(r.id))
      .map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        image: r.image,
        time: r.time,
        difficulty: r.difficulty,
        ingredients: r.ingredients,
        instructions: r.instructions,
      }));
    if (toInsert.length > 0) {
      const { error: insertErr } = await supabase
        .from("recipes")
        .insert(toInsert);
      if (insertErr)
        console.error("Error al insertar recetas faltantes:", insertErr);
    }
  } catch (error) {
    console.error("Error en ensureRecipes:", error);
  }
};

/**
 * Favoritos persistentes
 * Requiere tabla "favorites" con columnas:
 * - id (uuid)
 * - user_id (text)
 * - recipe_id (integer)
 */
export const getUserFavorites = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", userId);

    if (error) throw error;
    return (data || []).map((row) => parseInt(row.recipe_id));
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return [];
  }
};

export const toggleFavoriteRemote = async ({ userId, recipeId, isFav }) => {
  if (!userId || recipeId == null) return;
  const recipeNum = parseInt(recipeId);
  // ensure integer
  if (isNaN(recipeNum)) {
    console.error("toggleFavoriteRemote: recipeId inválido", recipeId);
    return;
  }

  // garantizar que la receta exista en la tabla antes de alternar el favorito
  const recipeToEnsure = recipesData.find((r) => r.id === recipeNum);
  if (recipeToEnsure) {
    // eslint-disable-next-line no-use-before-define
    await ensureRecipes([recipeToEnsure]);
  }
  try {
    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeNum);
      if (error) {
        return { success: false, error };
      }
      return { success: true };
    }

    // Intento principal: upsert con onConflict para (user_id,recipe_id)
    try {
      const resp = await supabase
        .from("favorites")
        .upsert(
          { user_id: userId, recipe_id: recipeNum },
          { onConflict: "user_id,recipe_id" },
        );
      if (resp?.error) {
        // si es duplicate key (23505) lo ignoramos
        if (resp.error.code === "23505") {
          return { success: true };
        }
        throw resp.error;
      }
      return { success: true };
    } catch (upsertErr) {
      // Si el servidor no soporta onConflict (42P10) o falla, intentamos flujo manual
      const msg = upsertErr?.message || "";
      if (upsertErr?.code === "42P10" || msg.includes("ON CONFLICT")) {
        try {
          // comprobar si ya existe
          const { data: existing, error: existErr } = await supabase
            .from("favorites")
            .select("id")
            .eq("user_id", userId)
            .eq("recipe_id", recipeNum)
            .limit(1);
          if (existErr) throw existErr;
          if (existing && existing.length > 0) {
            return { success: true };
          }

          // intentar insert simple
          const { error: insertErr } = await supabase.from("favorites").insert({
            user_id: userId,
            recipe_id: recipeNum,
          });
          if (insertErr) {
            // si el constraint es solo user_id (23505), lo ignoramos (documentado en README)
            if (insertErr.code === "23505") {
              console.warn(
                "Constraint único sobre user_id detectado:",
                insertErr.message,
              );
              return { success: true };
            }
            return { success: false, error: insertErr };
          }
          return { success: true };
        } catch (manualErr) {
          console.error("Error flujo manual favoritos:", manualErr);
          return { success: false, error: manualErr };
        }
      }

      console.error("Error en upsert favoritos:", upsertErr);
      return { success: false, error: upsertErr };
    }
  } catch (error) {
    console.error("Error al sincronizar favorito:", error);
    return { success: false, error };
  }
};

/**
 * Colecciones de recetas (diseño de modelo)
 * Requiere tablas:
 * - collections: id, user_id, name, description
 * - collection_recipes: collection_id, recipe_id
 */
export const createCollection = async ({ userId, name, description }) => {
  if (!userId || !name) return null;

  try {
    const { data, error } = await supabase
      .from("collections")
      .insert({ user_id: userId, name, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al crear colección:", error);
    return null;
  }
};

export const addRecipeToCollection = async ({ collectionId, recipeId }) => {
  if (!collectionId || !recipeId) return;

  try {
    const { error } = await supabase
      .from("collection_recipes")
      .insert({ collection_id: collectionId, recipe_id: recipeId });

    if (error) throw error;
  } catch (error) {
    console.error("Error al agregar receta a colección:", error);
  }
};

/**
 * Función para buscar recetas por término
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} Array de recetas que coinciden
 */
export const searchRecipes = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`,
      );

    if (error) throw error;
    return (data || []).map(normalizeRecipe);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    throw error;
  }
};

/**
 * Función para obtener recetas por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Promise<Array>} Array de recetas de la categoría
 */
export const getRecipesByCategory = async (category) => {
  try {
    if (category === "Todas") {
      return await getRecipes();
    }

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return (data || []).map(normalizeRecipe);
  } catch (error) {
    console.error(`Error al obtener recetas de "${category}":`, error);
    throw error;
  }
};
