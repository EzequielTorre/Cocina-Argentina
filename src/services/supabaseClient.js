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

export const toggleFavoriteRemote = async (userId, recipeId) => {
  if (!userId || !recipeId) throw new Error("userId and recipeId required");

  const { data: existing, error: selErr } = await supabase
    .from("favorites")
    .select("id")
    .match({ user_id: userId, recipe_id: recipeId });

  if (selErr) {
    console.error("toggleFavoriteRemote select error:", selErr);
    throw selErr;
  }

  if (existing && existing.length > 0) {
    const { error: delErr } = await supabase
      .from("favorites")
      .delete()
      .match({ user_id: userId, recipe_id: recipeId });

    if (delErr) {
      console.error("toggleFavoriteRemote delete error:", delErr);
      throw delErr;
    }
    return { removed: true };
  } else {
    const { data: insData, error: insErr } = await supabase
      .from("favorites")
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single();

    if (insErr) {
      console.error("toggleFavoriteRemote insert error:", insErr);
      throw insErr;
    }
    return { added: true, id: insData.id };
  }
};
