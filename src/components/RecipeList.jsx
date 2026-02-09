import { useState } from "react";
import RecipeCard from "./RecipeCard";
import { useRecipes } from "../context/RecipeContext";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const RecipeList = () => {
  const { searchRecipes, getCategories } = useRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Obtener todas las categorías del contexto
  const categories = getCategories();

  // Filtrar recetas usando la función del contexto
  const filteredRecipes = searchRecipes(searchTerm, selectedCategory);

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

      <div className="bg-body-tertiary p-4 rounded shadow-sm border mb-5">
        <Row className="g-3 justify-content-center">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text className="bg-body border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar recetas (ej. Empanadas)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0 shadow-none"
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
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
        <div className="text-center py-5">
          <p className="display-6 text-muted">
            No encontramos recetas con ese criterio.
          </p>
        </div>
      )}
    </Container>
  );
};

export default RecipeList;
