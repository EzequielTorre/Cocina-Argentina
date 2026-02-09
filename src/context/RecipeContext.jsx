import { createContext, useContext } from "react";
import recipesData from "../components/data/recipes.json";

// Crear el contexto
const RecipeContext = createContext();

/**
 * RecipeProvider - Proveedor que envuelve la aplicación
 * Proporciona acceso a todas las funciones relacionadas con recetas
 */
export function RecipeProvider({ children }) {
  /**
   * Obtiene todas las recetas
   * @returns {Array} Array con todas las recetas
   */
  const getRecipes = () => recipesData;

  /**
   * Obtiene una receta específica por ID
   * @param {string|number} id - ID de la receta
   * @returns {Object|null} La receta encontrada o null
   */
  const getRecipeById = (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      console.warn(`ID inválido: ${id}`);
      return null;
    }
    return recipesData.find((r) => r.id === numId);
  };

  /**
   * Obtiene todas las categorías únicas
   * @returns {Array} Array con categorías (incluye 'Todas' al inicio)
   */
  const getCategories = () => {
    const categories = new Set(recipesData.map((r) => r.category));
    return ["Todas", ...Array.from(categories)];
  };

  /**
   * Busca recetas por término y categoría
   * @param {string} searchTerm - Término a buscar
   * @param {string} category - Categoría a filtrar
   * @returns {Array} Array de recetas que coinciden con los criterios
   */
  const searchRecipes = (searchTerm = "", category = "Todas") => {
    return recipesData.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        category === "Todas" || recipe.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  // Proporcionar todas las funciones a través del contexto
  const value = {
    getRecipes,
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
