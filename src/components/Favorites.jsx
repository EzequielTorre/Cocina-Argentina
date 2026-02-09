import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "./RecipeCard";

const Favorites = () => {
  const { getFavorites } = useFavorites();
  const { getRecipes } = useRecipes();

  const favoriteIds = getFavorites();
  const allRecipes = getRecipes();
  const favoriteRecipes = allRecipes.filter((recipe) =>
    favoriteIds.includes(recipe.id),
  );

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Mis Favoritos ❤️</h1>
        <p className="lead text-secondary">
          {favoriteRecipes.length === 0
            ? "Aún no tienes recetas favoritas. ¡Empieza a agregar algunas!"
            : `Tienes ${favoriteRecipes.length} receta${favoriteRecipes.length !== 1 ? "s" : ""} favorita${favoriteRecipes.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-4">
            Navega a través de nuestras recetas y haz clic en el corazón para
            guardar tus favoritas.
          </p>
          <Button
            as={Link}
            to="/recetas"
            variant="primary"
            size="lg"
            className="rounded-pill"
          >
            Explorar Recetas
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {favoriteRecipes.map((recipe) => (
            <Col lg={4} md={6} xs={12} key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;
