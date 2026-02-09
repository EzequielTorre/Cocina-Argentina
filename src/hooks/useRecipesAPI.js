import { useState, useEffect } from "react";
import {
  getRecipes,
  searchRecipes as searchRecipesAPI,
  getRecipesByCategory,
  getRecipeById as getRecipeByIdAPI,
} from "../services/supabaseClient";

/**
 * Hook personalizado para obtener todas las recetas de Supabase
 * Maneja loading, error y datos
 */
export function useRecipesAPI() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Error cargando recetas:", err);
        setError(err.message || "Error al cargar las recetas");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error, setRecipes };
}

/**
 * Hook para buscar recetas por término
 * @param {string} searchTerm - Término a buscar
 */
export function useSearchRecipes(searchTerm) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchRecipesAPI(searchTerm);
        setResults(data);
      } catch (err) {
        console.error("Error buscando recetas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: espera 300ms antes de buscar
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { results, loading, error };
}

/**
 * Hook para obtener recetas por categoría
 * @param {string} category - Categoría a filtrar
 */
export function useRecipesByCategory(category) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecipesByCategory(category);
        setRecipes(data);
      } catch (err) {
        console.error("Error cargando categoría:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category]);

  return { recipes, loading, error };
}

/**
 * Hook para obtener una receta individual por ID
 * @param {number|string} id - ID de la receta
 */
export function useRecipeDetail(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecipeByIdAPI(id);
        setRecipe(data);
      } catch (err) {
        console.error(`Error cargando receta ${id}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
}
