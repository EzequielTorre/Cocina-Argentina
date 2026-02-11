import { Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import { FaClock, FaFire, FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import { useRatings } from "../context/RatingsContext";
import StarRating from "./StarRating";

const RecipeCard = ({ recipe }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getRating } = useRatings();
  const isFav = isFavorite(recipe.id);
  const rating = getRating(recipe.id);

  // Determinar el color del icono según la dificultad
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Fácil":
        return "text-success";
      case "Medio":
        return "text-warning";
      case "Difícil":
        return "text-danger";
      default:
        return "text-info";
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 hover-shadow transition-all">
      <div
        className="position-relative"
        style={{ height: "220px", overflow: "hidden" }}
      >
        <Card.Img
          variant="top"
          src={recipe.image}
          alt={recipe.title}
          className="h-100 w-100 object-fit-cover"
          style={{ objectFit: "cover" }}
        />
        <Badge
          bg="light"
          text="dark"
          className="position-absolute top-0 end-0 m-3 shadow-sm text-uppercase"
        >
          {recipe.category}
        </Badge>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className={`position-absolute top-0 start-0 m-3 btn p-2 rounded-circle ${
            isFav ? "btn-danger" : "btn-outline-danger"
          }`}
          title={isFav ? "Eliminar de favoritos" : "Agregar a favoritos"}
        >
          <FaHeart className="text-white" />
        </button>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{recipe.title}</Card.Title>
        <Card.Text className="text-secondary small flex-grow-1">
          {(recipe.descriptions || recipe.description) &&
          (recipe.descriptions || recipe.description).length > 100
            ? (recipe.descriptions || recipe.description).substring(0, 100) +
              "..."
            : recipe.descriptions ||
              recipe.description ||
              "Sin descripción disponible."}
        </Card.Text>

        {/* Rating */}
        {rating > 0 && (
          <div className="mb-2">
            <StarRating rating={rating} size="sm" />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-column flex-sm-row gap-2">
          <div className="d-flex gap-2 gap-sm-3 text-muted small flex-wrap">
            {/* Mostrar tiempo real de la receta */}
            <span
              className="d-flex align-items-center gap-1"
              title={`Tiempo de preparación: ${recipe.time} minutos`}
            >
              <FaClock className="text-warning" /> {recipe.time} min
            </span>
            {/* Mostrar dificultad real de la receta */}
            <span
              className="d-flex align-items-center gap-1"
              title={`Nivel de dificultad: ${recipe.difficulty}`}
            >
              <FaFire className={getDifficultyColor(recipe.difficulty)} />{" "}
              {recipe.difficulty}
            </span>
          </div>
          <Button
            as={Link}
            to={`/receta/${recipe.id}`}
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3 w-100 w-sm-auto"
          >
            Ver Receta
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
