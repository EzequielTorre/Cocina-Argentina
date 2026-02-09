import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { FaArrowLeft, FaPrint, FaShareAlt } from "react-icons/fa";
import { useRatings } from "../context/RatingsContext";
import { useRecipeDetail } from "../hooks/useRecipesAPI";
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
  const { recipe, loading, error } = useRecipeDetail(id);
  const { getRating, setRating } = useRatings();

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
            <p className="lead text-secondary mb-4">{recipe.description}</p>

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

            <div className="d-flex gap-3 pt-3 border-top">
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
                        text: recipe.description,
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
            <h3 className="h2 fw-bold border-bottom border-warning border-3 d-inline-block pb-2 mb-4">
              Ingredientes
            </h3>
            <ListGroup variant="flush">
              {recipe.ingredients.map((ingredient, index) => (
                <ListGroup.Item
                  key={index}
                  className="bg-transparent border-0 ps-0 d-flex align-items-center text-secondary"
                >
                  <span
                    className="bg-info rounded-circle me-3"
                    style={{ width: "8px", height: "8px" }}
                  ></span>
                  {ingredient}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Instrucciones */}
          <Col md={8}>
            <div className="border-start ps-md-5">
              <h3 className="h2 fw-bold border-bottom border-warning border-3 d-inline-block pb-2 mb-4">
                Instrucciones
              </h3>
              <div
                className="text-secondary lead"
                style={{ whiteSpace: "pre-line" }}
              >
                {recipe.instructions}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
