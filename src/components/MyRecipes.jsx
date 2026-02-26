import React, { useEffect, useState } from "react";
import { getRecipes } from "../services/supabaseClient";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        console.log("MyRecipes: fetching recipes...");
        const data = await getRecipes();
        console.log("MyRecipes: received", data.length, "recipes");
        if (mounted) {
          setRecipes(data);
          setError(null);
        }
      } catch (err) {
        console.error("MyRecipes fetch error:", err);
        if (mounted) setError(err.message || "Error al cargar recetas");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Cargando recetas...</div>;
  if (error) return <div>Error al cargar recetas: {error}</div>;
  if (!recipes.length) return <div>No hay recetas para mostrar</div>;

  return (
    <div>
      <h2>Recetas</h2>
      <ul>
        {recipes.map((r) => (
          <li key={r.id} style={{ marginBottom: 12 }}>
            <strong>{r.title}</strong> — {r.category}{" "}
            {r.time ? `— ${r.time} min` : ""}
            <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
              {r.ingredientsText}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
