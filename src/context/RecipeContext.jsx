import { createContext, useContext, useState, useEffect } from "react";
import recipesData from "../components/data/recipes.json";
import {
  getRecipes,
  getRecipeById as getRecipeByIdAPI,
} from "../services/supabaseClient";

// Crear el contexto
const RecipeContext = createContext();

/**
 * RecipeProvider - Proveedor que envuelve la aplicación
 * Obtiene recetas de Supabase, con fallback a datos locales
 */
export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar recetas de Supabase al montar el componente
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Intentar obtener recetas de Supabase
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.warn(
          "⚠️ Error al conectar con Supabase, usando datos locales:",
          err,
        );
        // Fallback: usar datos locales si Supabase falla
        setRecipes(recipesData);
        setError("Usando datos locales (Supabase no disponible)");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  /**
   * Obtiene todas las recetas
   * @returns {Array} Array con todas las recetas
   */
  const getAllRecipes = () => recipes;

  /**
   * Obtiene una receta específica por ID
   * @param {string|number} id - ID de la receta
   * @returns {Promise<Object>} La receta encontrada
   */
  const getRecipeById = async (id) => {
    try {
      // Primero intentar desde Supabase
      const data = await getRecipeByIdAPI(id);

      // Si no hay datos o faltan instrucciones, intentar fallback local
      if (!data || !data.instructions) {
        console.warn("⚠️ Receta incompleta en Supabase, buscando localmente");
        const numId = parseInt(id);
        const localRecipe = recipesData.find((r) => r.id === numId);
        if (localRecipe) return { ...localRecipe, ...data }; // Combinar si hay algo
      }

      return data;
    } catch (err) {
      console.warn(
        "⚠️ Error al obtener receta de Supabase, buscando localmente:",
        err,
      );
      // Fallback: buscar en datos locales
      const numId = parseInt(id);
      if (isNaN(numId)) {
        console.warn(`ID inválido: ${id}`);
        return null;
      }
      return recipesData.find((r) => r.id === numId) || null;
    }
  };

  /**
   * Obtiene todas las categorías únicas
   * @returns {Array} Array con categorías (incluye 'Todas' al inicio)
   */
  const getCategories = () => {
    if (recipes.length === 0) {
      // Fallback a datos locales si no hay recetas cargadas
      const categories = new Set(recipesData.map((r) => r.category));
      return ["Todas", ...Array.from(categories)];
    }

    const categories = new Set(recipes.map((r) => r.category));
    return ["Todas", ...Array.from(categories)];
  };

  /**
   * Busca recetas por término y categoría (en datos locales)
   * Para búsquedas más eficientes, usar useSearchRecipes hook
   * @param {string} searchTerm - Término a buscar
   * @param {string} category - Categoría a filtrar
   * @returns {Array} Array de recetas que coinciden con los criterios
   */
  const searchRecipes = (searchTerm = "", category = "Todas") => {
    const data = recipes && recipes.length > 0 ? recipes : recipesData;

    return data.filter((recipe) => {
      const title = recipe.title || "";
      const description = recipe.descriptions || recipe.description || "";

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "Todas" || recipe.category === category;

      return matchesSearch && matchesCategory;
    });
  };

  // Proporcionar todas las funciones a través del contexto
  const value = {
    recipes,
    loading,
    error,
    getAllRecipes,
    getRecipeById,
    getCategories,
    searchRecipes,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de recetas
 * IMPORTANTE: Solo debe usarse dentro de un componente envuelto por RecipeProvider
 * @throws {Error} Si se usa fuera de RecipeProvider
 * @returns {Object} Objeto con todas las funciones del contexto
 */
export function useRecipes() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error(
      "❌ useRecipes debe usarse dentro de un componente hijo de <RecipeProvider>",
    );
  }

  return context;
}
