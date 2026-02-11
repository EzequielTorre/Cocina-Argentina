import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  FaArrowLeft,
  FaPrint,
  FaShareAlt,
  FaUtensils,
  FaCoffee,
  FaExchangeAlt,
} from "react-icons/fa";
import { useRatings } from "../context/RatingsContext";
import { useRecipes } from "../context/RecipeContext";
import StarRating from "./StarRating";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorAlert from "./ui/ErrorAlert";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  ListGroup,
} from "react-bootstrap";

const RecipeDetail = () => {
  const { id } = useParams();
  const { getRecipeById } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getRating, setRating } = useRatings();
  const [cookingMode, setCookingMode] = useState(false);
  const [unitSystem, setUnitSystem] = useState("metric"); // 'metric' o 'imperial'

  const toggleCookingMode = async () => {
    if (!cookingMode) {
      try {
        if ("wakeLock" in navigator) {
          await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        console.error("Wake Lock error:", err);
      }
    }
    setCookingMode(!cookingMode);
  };

  const convertUnits = (ingredient) => {
    if (unitSystem === "metric") return ingredient;

    // Regex simple para detectar gramos o ml y convertir (ejemplo básico)
    return ingredient.replace(
      /(\d+)\s*(g|gr|gramos|ml|mililitros)/gi,
      (match, p1, p2) => {
        const value = parseInt(p1);
        if (p2.toLowerCase().includes("g")) {
          const oz = (value * 0.035274).toFixed(1);
          return `${oz} oz (${value}g)`;
        } else {
          const flOz = (value * 0.033814).toFixed(1);
          return `${flOz} fl oz (${value}ml)`;
        }
      },
    );
  };

  const isSweetCategory =
    recipe?.category === "Postre" ||
    recipe?.title?.toLowerCase().includes("alfajor") ||
    recipe?.title?.toLowerCase().includes("dulce");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, getRecipeById]);

  const rating = recipe ? getRating(recipe.id) : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Cargando receta..." />;
  }

  if (error || !recipe) {
    return (
      <Container className="text-center py-5">
        {error && <ErrorAlert message={error} variant="danger" />}
        <h2 className="text-muted display-6 mt-4">Receta no encontrada...</h2>
        <p className="text-secondary mb-4">
          La receta que buscas no existe o hubo un error al cargarla.
        </p>
        <Link to="/recetas" className="btn btn-primary">
          Volver al recetario
        </Link>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      {/* Breadcrumb / Back */}
      <div className="mb-4 pt-4">
        <Link
          to="/recetas"
          className="d-inline-flex align-items-center text-secondary text-decoration-none fw-bold"
        >
          <FaArrowLeft className="me-2" /> Volver al recetario
        </Link>
      </div>

      {/* Header Section */}
      <Row className="mb-5 align-items-start">
        <Col md={6} className="mb-4 mb-md-0">
          <div
            className="rounded overflow-hidden shadow"
            style={{ height: "400px" }}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-100 h-100 object-fit-cover"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Col>

        <Col md={6}>
          <div className="ps-md-4">
            <Badge bg="info" className="mb-3 text-uppercase p-2">
              {recipe.category}
            </Badge>
            <h1 className="display-4 fw-bold mb-3">{recipe.title}</h1>
            <p className="lead text-secondary mb-4">
              {recipe.descriptions || recipe.description}
            </p>

            {/* Rating Section */}
            <div className="bg-body-tertiary p-3 rounded-3 mb-4">
              <p className="small text-secondary mb-2">
                ¿Qué te pareció esta receta?
              </p>
              <StarRating
                rating={rating}
                onRatingChange={(newRating) => setRating(recipe.id, newRating)}
                interactive={true}
                size="lg"
              />
            </div>

            <div className="d-flex flex-wrap gap-2 pt-3 border-top">
              <Button
                variant={cookingMode ? "warning" : "outline-warning"}
                className="d-flex align-items-center gap-2 shadow-sm"
                onClick={toggleCookingMode}
                title="Mantener pantalla encendida y letra grande"
              >
                <FaUtensils />{" "}
                {cookingMode ? "Salir Modo Cocina" : "Modo Cocina"}
              </Button>
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2 shadow-sm"
                onClick={() => window.print()}
                title="Imprimir esta receta"
              >
                <FaPrint /> Imprimir
              </Button>
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2 shadow-sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: recipe.title,
                        text: recipe.description || recipe.descriptions,
                        url: window.location.href,
                      })
                      .catch(() => {});
                  } else {
                    alert("Compartir no está disponible en este navegador");
                  }
                }}
                title="Compartir esta receta"
              >
                <FaShareAlt /> Compartir
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Content Section */}
      <Card className="shadow-sm border-0 p-4 p-md-5">
        <Row>
          {/* Ingredientes */}
          <Col md={4} className="mb-5 mb-md-0">
            <div className="d-flex justify-content-between align-items-center border-bottom border-warning border-3 mb-4">
              <h3 className="h2 fw-bold d-inline-block pb-2 mb-0">
                Ingredientes
              </h3>
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none text-muted"
                onClick={() =>
                  setUnitSystem(unitSystem === "metric" ? "imperial" : "metric")
                }
              >
                <FaExchangeAlt />{" "}
                {unitSystem === "metric" ? "Ver en oz" : "Ver en g/ml"}
              </Button>
            </div>
            <ListGroup variant="flush">
              {(recipe.ingredients || recipe.ingredientes || []).map(
                (ingredient, index) => (
                  <ListGroup.Item
                    key={index}
                    className="bg-transparent border-0 ps-0 d-flex align-items-center text-secondary"
                  >
                    <span
                      className="bg-info rounded-circle me-3"
                      style={{ width: "8px", height: "8px" }}
                    ></span>
                    {convertUnits(ingredient)}
                  </ListGroup.Item>
                ),
              )}
            </ListGroup>

            {isSweetCategory && (
              <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25 d-flex align-items-center gap-3">
                <FaCoffee className="text-warning fs-3" />
                <div>
                  <h6 className="mb-1 fw-bold">Maridaje con Mate</h6>
                  <p className="small mb-0 text-secondary">
                    Ideal para acompañar con unos amargos.
                  </p>
                </div>
              </div>
            )}
          </Col>

          {/* Instrucciones */}
          <Col md={8}>
            <div className="border-start ps-md-5">
              <h3 className="h2 fw-bold border-bottom border-warning border-3 d-inline-block pb-2 mb-4">
                Instrucciones
              </h3>
              <div
                className={`text-secondary ${cookingMode ? "display-6 fw-normal lh-base" : "lead"}`}
                style={{ whiteSpace: "pre-line" }}
              >
                {Array.isArray(
                  recipe.instruccions ||
                    recipe.instructions ||
                    recipe.instrucciones,
                )
                  ? (
                      recipe.instruccions ||
                      recipe.instructions ||
                      recipe.instrucciones
                    ).join("\n")
                  : recipe.instruccions ||
                    recipe.instructions ||
                    recipe.instrucciones ||
                    "No hay instrucciones disponibles para esta receta."}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
