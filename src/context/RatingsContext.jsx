import { createContext, useContext, useState, useEffect } from "react";

const RatingsContext = createContext();

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});

  // Cargar ratings desde localStorage al iniciar
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

  const setRating = (recipeId, rating) => {
    if (rating < 0 || rating > 5) {
      console.error("Rating debe estar entre 0 y 5");
      return;
    }
    setRatings((prev) => ({
      ...prev,
      [recipeId]: rating,
    }));
  };

  const getRating = (recipeId) => {
    return ratings[recipeId] || 0;
  };

  const getAllRatings = () => ratings;

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        setRating,
        getRating,
        getAllRatings,
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
