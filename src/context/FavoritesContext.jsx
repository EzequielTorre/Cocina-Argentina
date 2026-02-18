import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  getUserFavorites,
  toggleFavoriteRemote,
} from "../services/supabaseClient";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useUser();

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(saved);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      setFavorites([]);
    }
  }, []);

  // Cuando el usuario está logueado, sincronizar con Supabase
  useEffect(() => {
    const syncFavorites = async () => {
      if (!user?.id) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
        return;
      }

      try {
        const remote = await getUserFavorites(user.id);
        setFavorites(remote);
      } catch (error) {
        console.error("Error sincronizando favoritos remotos:", error);
      }
    };

    syncFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Guardar en localStorage cuando cambian los favoritos (cache local)
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = async (recipeId) => {
    const prev = favorites;
    const next = prev.includes(recipeId) ? prev : [...prev, recipeId];
    setFavorites(next);

    if (user?.id) {
      const result = await toggleFavoriteRemote({
        userId: user.id,
        recipeId,
        isFav: false,
      });
      if (!result?.success) {
        setFavorites(prev);
        console.error(
          "No se pudo agregar favorito en Supabase:",
          result?.error,
        );
      }
    }
  };

  const removeFavorite = async (recipeId) => {
    const prev = favorites;
    const next = prev.filter((id) => id !== recipeId);
    setFavorites(next);

    if (user?.id) {
      const result = await toggleFavoriteRemote({
        userId: user.id,
        recipeId,
        isFav: true,
      });
      if (!result?.success) {
        setFavorites(prev);
        console.error("No se pudo quitar favorito en Supabase:", result?.error);
      }
    }
  };

  const toggleFavorite = (recipeId) => {
    if (isFavorite(recipeId)) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipeId);
    }
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const getFavorites = () => favorites;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        getFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe estar dentro de FavoritesProvider");
  }
  return context;
};
