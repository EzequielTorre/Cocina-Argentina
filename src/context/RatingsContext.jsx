import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { upsertRating, getRecipeRatingStats } from "../services/supabaseClient";

const RatingsContext = createContext();

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});
  const [remoteStats, setRemoteStats] = useState({});
  const { user } = useUser();

  // Cargar ratings desde localStorage al iniciar (cache local)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ratings") || "{}");
      setRatings(saved);
    } catch (error) {
      console.error("Error cargando ratings:", error);
      setRatings({});
    }
  }, []);

  // Guardar en localStorage cuando cambian los ratings
  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  const setRating = async (recipeId, rating) => {
    if (rating < 0 || rating > 5) {
      console.error("Rating debe estar entre 0 y 5");
      return;
    }
    const idNum = parseInt(recipeId);
    const prevRatings = ratings;
    const nextRatings = { ...ratings, [idNum]: rating };
    setRatings(nextRatings);

    if (user?.id) {
      const result = await upsertRating({
        userId: user.id,
        recipeId: idNum,
        value: rating,
      });
      if (!result?.success) {
        // no revert; keep local opinion and log error for debugging
        console.error(
          "No se pudo guardar el rating en Supabase (detalle):",
          result?.error,
        );
      } else {
        const stats = await getRecipeRatingStats({
          recipeId: idNum,
          userId: user.id,
        });
        setRemoteStats((prev) => ({
          ...prev,
          [idNum]: {
            average: stats.avg || 0,
            count: stats.count || 0,
            userRating: rating,
          },
        }));
      }
    }
  };

  const getRating = (recipeId) => {
    return ratings[recipeId] || 0;
  };

  const getAllRatings = () => ratings;

  const getRatingStats = (recipeId) => {
    return (
      remoteStats[recipeId] || {
        average: getRating(recipeId),
        count: 0,
        userRating: getRating(recipeId),
      }
    );
  };

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        setRating,
        getRating,
        getAllRatings,
        getRatingStats,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error("useRatings debe estar dentro de RatingsProvider");
  }
  return context;
};
