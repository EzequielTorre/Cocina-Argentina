import { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./ui/RecipeCardSkeleton";
import { useRecipes } from "../context/RecipeContext";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorAlert from "./ui/ErrorAlert";
import EmptyState from "./ui/EmptyState";

const RecipeList = () => {
  const { recipes, loading, error, searchRecipes, getCategories } =
    useRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);

  // Obtener todas las categorías del contexto
  const categories = getCategories();
  const difficulties = ["Todas", "Fácil", "Media", "Difícil"];

  // Filtrar recetas usando la función del contexto
  const filteredRecipes = searchRecipes(
    searchTerm,
    selectedCategory,
    selectedDifficulty,
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todas");
    setSelectedDifficulty("Todas");
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold mb-3">Nuestras Recetas</h2>
        <p
          className="lead text-secondary mx-auto"
          style={{ maxWidth: "600px" }}
        >
          Explora nuestra colección de platos tradicionales.
        </p>
      </div>

      {loading ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {[...Array(6)].map((_, idx) => (
            <Col key={idx}>
              <RecipeCardSkeleton />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <ErrorAlert message={error} variant="warning" />
      ) : (
        <>
          <div className="bg-body-tertiary p-4 rounded shadow-sm border mb-5">
            <Row className="g-3 align-items-center">
              <Col md={7}>
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o ingredientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0 shadow-none py-2"
                  />
                  {searchTerm && (
                    <Button
                      variant="outline-secondary"
                      className="border-start-0 border-end-0 bg-white text-muted"
                      onClick={() => setSearchTerm("")}
                    >
                      <FaTimes />
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col md={3} className="d-flex gap-2">
                <Button
                  variant={showFilters ? "primary" : "outline-primary"}
                  className="w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter /> {showFilters ? "Ocultar Filtros" : "Más Filtros"}
                </Button>
              </Col>
              <Col md={2}>
                <Button
                  variant="link"
                  className="text-muted text-decoration-none w-100"
                  onClick={resetFilters}
                >
                  Limpiar todo
                </Button>
              </Col>
            </Row>

            {showFilters && (
              <Row className="g-3 mt-2 pt-3 border-top">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-uppercase text-muted">
                      Categoría
                    </Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="cursor-pointer shadow-sm"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-uppercase text-muted">
                      Dificultad
                    </Form.Label>
                    <Form.Select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="cursor-pointer shadow-sm"
                    >
                      {difficulties.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-secondary mb-0">
              {filteredRecipes.length} receta
              {filteredRecipes.length !== 1 ? "s" : ""} encontrada
              {filteredRecipes.length !== 1 ? "s" : ""}
            </h4>
          </div>

          {filteredRecipes.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredRecipes.map((recipe) => (
                <Col key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </Col>
              ))}
            </Row>
          ) : (
            <EmptyState
              message="No encontramos recetas con esos filtros."
              onAction={resetFilters}
              actionLabel="Ver todas las recetas"
            />
          )}
        </>
      )}
    </Container>
  );
};

export default RecipeList;
