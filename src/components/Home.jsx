import Carousel from "./Carousel";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./ui/RecipeCardSkeleton";
import ErrorAlert from "./ui/ErrorAlert";
import { useEffect, useState, useMemo } from "react";
import {
  FaUtensils,
  FaStar,
  FaClock,
  FaFire,
  FaQuoteLeft,
} from "react-icons/fa";

const Home = () => {
  const { recipes, loading, error } = useRecipes();

  // 1. Receta del Día (Basada en la fecha actual para que cambie cada 24h)
  const recipeOfTheDay = useMemo(() => {
    if (!recipes || recipes.length === 0) return null;
    const dayOfYear = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) /
        (1000 * 60 * 60 * 24),
    );
    return recipes[dayOfYear % recipes.length];
  }, [recipes]);

  // 2. Los Mejores Postres (Filtrado por categoría y simulando un top)
  const bestDesserts = useMemo(() => {
    return recipes.filter((r) => r.category === "Postre").slice(0, 3);
  }, [recipes]);

  // 3. Recetas Recientes (Las últimas 3 agregadas)
  const recentRecipes = useMemo(() => {
    return [...recipes].slice(0, 3);
  }, [recipes]);

  return (
    <div className="pb-5 bg-light">
      {/* Hero Section - Rediseñada */}
      <section
        className="position-relative overflow-hidden py-5 mb-5"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
          color: "white",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Decoración de fondo */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%)",
          }}
        ></div>

        <Container className="position-relative z-1">
          <Row className="align-items-center g-5">
            <Col lg={6} className="text-center text-lg-start">
              <Badge
                bg="info"
                className="mb-3 text-uppercase px-3 py-2 ls-2 fw-bold"
              >
                Tradición Argentina
              </Badge>
              <h1 className="display-2 fw-bold mb-4">
                El Corazón de <br />
                Nuestra <span className="text-info">Cocina</span>
              </h1>
              <p className="lead mb-5 opacity-75">
                Explora la colección más completa de recetas tradicionales.
                Desde el asado del domingo hasta los postres de la abuela, todo
                en un solo lugar.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Button
                  as={Link}
                  to="/recetas"
                  variant="info"
                  size="lg"
                  className="rounded-pill px-5 py-3 shadow-lg fw-bold"
                >
                  Ver Recetario
                </Button>
                <Button
                  as={Link}
                  to="/mis-recetas"
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill px-5 py-3 fw-bold"
                >
                  Subir Receta
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <Carousel />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Receta del Día */}
      {recipeOfTheDay && (
        <section className="mb-5">
          <Container>
            <div className="bg-white rounded-4 shadow-lg overflow-hidden border-0">
              <Row className="g-0">
                <Col md={6}>
                  <div
                    className="h-100 position-relative"
                    style={{ minHeight: "350px" }}
                  >
                    <img
                      src={recipeOfTheDay.image}
                      alt={recipeOfTheDay.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <Badge
                        bg="warning"
                        className="text-dark fs-6 px-3 py-2 shadow"
                      >
                        ⭐ Receta del Día
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col
                  md={6}
                  className="p-4 p-md-5 d-flex flex-column justify-content-center"
                >
                  <span className="text-info fw-bold text-uppercase small mb-2">
                    {recipeOfTheDay.category}
                  </span>
                  <h2 className="display-5 fw-bold mb-3">
                    {recipeOfTheDay.title}
                  </h2>
                  <p className="text-muted mb-4 lead">
                    {recipeOfTheDay.description || recipeOfTheDay.descriptions}
                  </p>
                  <div className="d-flex gap-4 mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <FaClock className="text-info" />
                      <span>{recipeOfTheDay.time} min</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaFire className="text-danger" />
                      <span>{recipeOfTheDay.difficulty}</span>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    to={`/receta/${recipeOfTheDay.id}`}
                    variant="primary"
                    size="lg"
                    className="rounded-pill px-4 align-self-start"
                  >
                    Cocinar Ahora
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        </section>
      )}

      {/* Los Mejores Postres */}
      <section className="py-5 bg-white shadow-sm mb-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="display-5 fw-bold mb-0">
                Los Mejores <span className="text-info">Postres</span>
              </h2>
              <p className="text-muted mt-2">
                Nuestra selección más dulce para terminar el día.
              </p>
            </div>
            <Button
              as={Link}
              to="/recetas"
              variant="link"
              className="text-info text-decoration-none fw-bold"
            >
              Ver todos →
            </Button>
          </div>

          <Row className="g-4">
            {loading
              ? [...Array(3)].map((_, idx) => (
                  <Col key={idx} md={4}>
                    <RecipeCardSkeleton />
                  </Col>
                ))
              : bestDesserts.map((recipe) => (
                  <Col key={recipe.id} md={4}>
                    <RecipeCard recipe={recipe} />
                  </Col>
                ))}
          </Row>
        </Container>
      </section>

      {/* Mission Section - Mejorada */}
      <section className="py-5 mb-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6}>
              <div className="pe-md-5">
                <FaQuoteLeft className="display-1 text-info opacity-25 mb-4" />
                <h2 className="display-4 fw-bold mb-4">
                  La pasión de <br /> compartir.
                </h2>
                <p className="lead text-secondary mb-4">
                  En Cocina Argentina, no solo guardamos ingredientes, guardamos
                  memorias. Cada plato es un legado de nuestras familias que
                  merece ser compartido y preservado.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-info rounded-circle p-3 text-white">
                    <FaUtensils size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">+50 Recetas</h5>
                    <small className="text-muted">
                      Tradicionales y Modernas
                    </small>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="position-relative p-4">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-info rounded-4 opacity-10 translate-middle-x ms-5 mt-5"></div>
                <div
                  className="rounded-4 overflow-hidden shadow-lg position-relative z-1"
                  style={{ height: "450px" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Cocina Argentina"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recetas Recientes */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Últimas Incorporaciones</h2>
            <div
              className="bg-info mx-auto rounded-pill mb-4"
              style={{ width: "80px", height: "4px" }}
            ></div>
          </div>

          <Row className="g-4">
            {loading
              ? [...Array(3)].map((_, idx) => (
                  <Col key={idx} md={4}>
                    <RecipeCardSkeleton />
                  </Col>
                ))
              : recentRecipes.map((recipe) => (
                  <Col key={recipe.id} md={4}>
                    <RecipeCard recipe={recipe} />
                  </Col>
                ))}
          </Row>

          <div className="text-center mt-5 pt-4">
            <Button
              as={Link}
              to="/recetas"
              variant="outline-info"
              size="lg"
              className="rounded-pill px-5"
            >
              Ver todo el catálogo
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
