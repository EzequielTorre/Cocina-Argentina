import { createClient } from "@supabase/supabase-js";

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
    return data || [];
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
    return data;
  } catch (error) {
    console.error(`Error al obtener receta ${id}:`, error);
    return null; // Devolver null en lugar de lanzar error
  }
};

/**
 * Función para crear una nueva receta (admin only)
 * @param {Object} recipe - Objeto con datos de la receta
 * @returns {Promise<Object>} La receta creada
 */
export const createRecipe = async (recipe) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .insert([recipe])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al crear receta:", error);
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
    return data || [];
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
    return data || [];
  } catch (error) {
    console.error(`Error al obtener recetas de "${category}":`, error);
    throw error;
  }
};
