import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Normaliza ingredients/instructions que puedan venir como array literal
 * o como texto plano. Devuelve siempre strings para mostrar y arrays para uso.
 */
const parsePgArrayLiteral = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  // Postgres array literal: {"a","b","c"}
  if (typeof val === "string" && val.startsWith("{") && val.endsWith("}")) {
    // quitar { } y dividir respetando comillas simples/ dobles
    const inner = val.slice(1, -1);
    // split simple por "," considerando que comillas internas no se manejan aquí
    return inner.split('","').map((s) => s.replace(/^"|"$|^'|'$/g, "").trim());
  }
  // fallback: intentar separar por saltos de línea o comas
  return val
    .split(/\r?\n|,+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const normalizeRecipe = (row = {}) => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    category: row.category,
    difficulty: row.difficulty,
    time: row.time,
    servings: row.servings,
    ingredientsText:
      typeof row.ingredients === "string"
        ? row.ingredients
        : Array.isArray(row.ingredients)
          ? row.ingredients.join("\n")
          : "",
    ingredients: parsePgArrayLiteral(row.ingredients),
    instructionsText:
      typeof row.instructions === "string"
        ? row.instructions
        : Array.isArray(row.instructions)
          ? row.instructions.join("\n")
          : "",
    instructions: parsePgArrayLiteral(row.instructions),
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id ?? null,
  };
};

export const getRecipes = async () => {
  console.log("supabaseClient: fetching recipes...");
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("supabaseClient getRecipes error:", error);
    throw error;
  }
  const normalized = (data || []).map(normalizeRecipe);
  console.log("supabaseClient getRecipes result count:", normalized.length);
  return normalized;
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
  try {
    const payload = { ...recipe };
    if (userId) payload.user_id = userId;
    // si recipe.ingredients es array, lo convertimos a texto para evitar errores
    if (Array.isArray(payload.ingredients))
      payload.ingredients = payload.ingredients.join("\n");
    if (Array.isArray(payload.instructions))
      payload.instructions = payload.instructions.join("\n");

    console.log("supabaseClient createRecipe payload:", payload);
    const { data, error } = await supabase
      .from("recipes")
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error("supabaseClient createRecipe error:", error);
      throw error;
    }
    return normalizeRecipe(data);
  } catch (err) {
    console.error("createRecipe exception:", err);
    throw err;
  }
};

export const updateRecipe = async (id, updates) => {
  if (updates.ingredients && Array.isArray(updates.ingredients))
    updates.ingredients = updates.ingredients.join("\n");
  if (updates.instructions && Array.isArray(updates.instructions))
    updates.instructions = updates.instructions.join("\n");
  const { data, error } = await supabase
    .from("recipes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return normalizeRecipe(data);
};

export const deleteRecipe = async (id) => {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
};
