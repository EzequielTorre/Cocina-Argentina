import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Normaliza ingredients/instructions que puedan venir como array literal
 * o como texto plano. Devuelve siempre arrays (para uso lógico) y también
 * strings para mostrar.
 */
const parsePgArrayLiteral = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((s) => String(s));
  if (typeof val !== "string") return [];

  const str = val.trim();

  // Postgres array literal: {"a","b","c"} o {"a","b, c"}
  if (str.startsWith("{") && str.endsWith("}")) {
    const inner = str.slice(1, -1);
    // separar por "," respetando comillas simples/dobles simples
    const items = [];
    let cur = "";
    let inQuotes = false;
    let quoteChar = null;
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if ((ch === '"' || ch === "'") && inner[i - 1] !== "\\") {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = ch;
          continue;
        } else if (quoteChar === ch) {
          inQuotes = false;
          quoteChar = null;
          continue;
        }
      }
      if (ch === "," && !inQuotes) {
        items.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    if (cur.length) items.push(cur);
    return items
      .map((s) => s.replace(/^"|"$|^'|'$/g, "").trim())
      .filter(Boolean);
  }

  // fallback: dividir por saltos de línea o comas
  return str
    .split(/\r?\n|,+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const normalizeRecipe = (row = {}) => {
  const ingredientsArr = parsePgArrayLiteral(row.ingredients);
  const instructionsArr = parsePgArrayLiteral(row.instructions);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    category: row.category,
    difficulty: row.difficulty,
    time: row.time,
    servings: row.servings,
    ingredients: ingredientsArr,
    ingredientsText:
      typeof row.ingredients === "string"
        ? row.ingredients
        : ingredientsArr.join("\n"),
    instructions: instructionsArr,
    instructionsText:
      typeof row.instructions === "string"
        ? row.instructions
        : instructionsArr.join("\n"),
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id ?? null,
    author_name: row.author_name || null,
    author_image: row.author_image || null,
  };
};

export const getRecipes = async () => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRecipes error:", error);
    throw error;
  }
  return (data || []).map(normalizeRecipe);
};

export const getRecipeById = async (id) => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return normalizeRecipe(data);
};

export const createRecipe = async (recipe, { userId, pending } = {}) => {
  const payload = { ...recipe };
  if (userId) payload.user_id = userId;

  // Asegurar que ingredients/instructions sean strings (evita array literal)
  if (Array.isArray(payload.ingredients))
    payload.ingredients = payload.ingredients.join("\n");
  if (Array.isArray(payload.instructions))
    payload.instructions = payload.instructions.join("\n");

  const { data, error } = await supabase
    .from("recipes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("createRecipe error:", error);
    throw error;
  }
  return normalizeRecipe(data);
};

export const updateRecipe = async (id, updates) => {
  const payload = { ...updates };
  if (Array.isArray(payload.ingredients))
    payload.ingredients = payload.ingredients.join("\n");
  if (Array.isArray(payload.instructions))
    payload.instructions = payload.instructions.join("\n");

  const { data, error } = await supabase
    .from("recipes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateRecipe error:", error);
    throw error;
  }
  return normalizeRecipe(data);
};

export const deleteRecipe = async (id) => {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) {
    console.error("deleteRecipe error:", error);
    throw error;
  }
  return true;
};

export const getUserFavorites = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", userId);

  if (error) {
    console.error("getUserFavorites error:", error);
    throw error;
  }
  return (data || []).map((r) => r.recipe_id);
};

export const toggleFavoriteRemote = async ({ userId, recipeId }) => {
  if (!userId || !recipeId) throw new Error("userId and recipeId required");

  const { data: existing, error: selErr } = await supabase
    .from("favorites")
    .select("id")
    .match({ user_id: userId, recipe_id: recipeId });

  if (selErr) {
    console.error("toggleFavoriteRemote select error:", selErr);
    return { success: false, error: selErr };
  }

  if (existing && existing.length > 0) {
    const { error: delErr } = await supabase
      .from("favorites")
      .delete()
      .match({ user_id: userId, recipe_id: recipeId });

    if (delErr) {
      console.error("toggleFavoriteRemote delete error:", delErr);
      return { success: false, error: delErr };
    }
    return { success: true, removed: true };
  } else {
    const { data: insData, error: insErr } = await supabase
      .from("favorites")
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single();

    if (insErr) {
      console.error("toggleFavoriteRemote insert error:", insErr);
      return { success: false, error: insErr };
    }
    return { success: true, added: true, id: insData.id };
  }
};

export const upsertRating = async ({ userId, recipeId, rating }) => {
  if (!userId || !recipeId) throw new Error("userId and recipeId required");
  const payload = { user_id: userId, recipe_id: recipeId, value: rating };
  // Intentar upsert (requiere constraint unique on (user_id, recipe_id))
  try {
    const { data, error } = await supabase
      .from("ratings")
      .upsert(payload, {
        onConflict: ["user_id", "recipe_id"],
        returning: "representation",
      })
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    // Fallback: buscar y actualizar o insertar
    try {
      const { data: existing, error: selErr } = await supabase
        .from("ratings")
        .select("id")
        .match({ user_id: userId, recipe_id: recipeId })
        .single();
      if (selErr && selErr.code !== "PGRST116") throw selErr;
      if (existing && existing.id) {
        const { data, error: updErr } = await supabase
          .from("ratings")
          .update({ value: rating })
          .eq("id", existing.id)
          .select()
          .single();
        if (updErr) throw updErr;
        return { success: true, data };
      } else {
        const { data, error: insErr } = await supabase
          .from("ratings")
          .insert(payload)
          .select()
          .single();
        if (insErr) throw insErr;
        return { success: true, data };
      }
    } catch (finalErr) {
      return { success: false, error: finalErr };
    }
  }
};

export const getRecipeRatingStats = async ({ recipeId }) => {
  if (!recipeId) return { avg: null, count: 0 };
  const { data, error } = await supabase
    .from("ratings")
    .select("value")
    .eq("recipe_id", recipeId);
  if (error) {
    console.error("getRecipeRatingStats error:", error);
    return { avg: null, count: 0 };
  }
  const arr = data || [];
  const count = arr.length;
  const avg = count
    ? arr.reduce((s, r) => s + Number(r.value || 0), 0) / count
    : null;
  return { avg, count };
};

/**
 * Asegura que una lista de recetas exista en la base de datos (upsert)
 * Útil para sincronizar datos locales con remotos
 */
export const ensureRecipes = async (recipes) => {
  if (!Array.isArray(recipes) || recipes.length === 0) return;

  const formatted = recipes.map((r) => {
    const payload = { ...r };
    // Limpiar campos que no deben ir al upsert si es necesario
    // o asegurar que ingredientes/instrucciones sean strings si vienen como arrays
    if (Array.isArray(payload.ingredients))
      payload.ingredients = payload.ingredients.join("\n");
    if (Array.isArray(payload.instructions))
      payload.instructions = payload.instructions.join("\n");
    return payload;
  });

  const { error } = await supabase.from("recipes").upsert(formatted, {
    onConflict: "id",
  });

  if (error) {
    console.error("ensureRecipes error:", error);
    throw error;
  }
  return true;
};

// --- COMENTARIOS ---

export const getComments = async (recipeId) => {
  if (!recipeId) return [];
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getComments error:", error);
    return [];
  }
  return data || [];
};

export const addComment = async ({
  recipeId,
  userId,
  userName,
  userImage,
  content,
}) => {
  if (!recipeId || !userId || !content) {
    throw new Error("recipeId, userId and content are required");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      recipe_id: recipeId,
      user_id: userId,
      user_name: userName,
      user_image: userImage,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("addComment error:", error);
    throw error;
  }
  return data;
};

export const deleteComment = async (commentId, userId) => {
  if (!commentId || !userId) throw new Error("commentId and userId required");

  const { error } = await supabase
    .from("comments")
    .delete()
    .match({ id: commentId, user_id: userId });

  if (error) {
    console.error("deleteComment error:", error);
    throw error;
  }
  return true;
};

// --- PERFILES DE USUARIO ---

export const getUserProfile = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getUserProfile error:", error);
    return null;
  }
  return data;
};

export const upsertUserProfile = async (profileData) => {
  if (!profileData.user_id) throw new Error("user_id is required");

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(profileData, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    console.error("upsertUserProfile error:", error);
    throw error;
  }
  return data;
};

// --- STORAGE (IMÁGENES) ---

/**
 * Sube una imagen al bucket especificado y devuelve la URL pública
 * @param {File} file - El archivo de imagen
 * @param {string} bucket - Nombre del bucket ('recipe-images' o 'avatars')
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadImage = async (file, bucket = "recipe-images") => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir el archivo
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obtener la URL pública
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error("Error al subir imagen:", err);
    throw err;
  }
};

// --- NOTIFICACIONES ---

export const getNotifications = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getNotifications error:", error);
    return [];
  }
  return data || [];
};

export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) return;
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("markNotificationAsRead error:", error);
  }
};

export const createNotification = async ({
  userId,
  type,
  content,
  recipeId,
  fromUserName,
}) => {
  if (!userId) return;
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    content,
    recipe_id: recipeId,
    from_user_name: fromUserName,
  });

  if (error) {
    console.error("createNotification error:", error);
  }
};

export const subscribeToNotifications = (userId, onNewNotification) => {
  if (!userId) return null;

  return supabase
    .channel(`notifications-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewNotification(payload.new);
      },
    )
    .subscribe();
};
