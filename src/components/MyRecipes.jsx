import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { createRecipe } from "../services/supabaseClient";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import {
  FaPlus,
  FaUtensils,
  FaClock,
  FaImage,
  FaListUl,
  FaBookOpen,
} from "react-icons/fa";

export default function MyRecipes() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Principal",
    time: "",
    difficulty: "Media",
    image: "",
    ingredients: "",
    instructions: "",
    servings: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Debes estar logueado para crear una receta.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar los datos para Supabase
      const recipeData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        time: parseInt(formData.time) || null,
        difficulty: formData.difficulty,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1495195129352-aec3297705a5?q=80&w=2070&auto=format&fit=crop", // Imagen por defecto si no hay una
        ingredients: formData.ingredients, // El servicio se encarga de normalizarlo
        instructions: formData.instructions, // El servicio se encarga de normalizarlo
        servings: parseInt(formData.servings) || null,
        author_name: user.fullName || user.username || "Usuario de Cocina Argentina",
        author_image: user.imageUrl,
      };

      const newRecipe = await createRecipe(recipeData, { userId: user.id });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/receta/${newRecipe.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error al crear la receta:", err);
      setError(
        "Hubo un error al guardar tu receta. Por favor, intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white py-3">
          <h2 className="mb-0 d-flex align-items-center gap-2">
            <FaPlus /> Crear Nueva Receta
          </h2>
        </Card.Header>
        <Card.Body className="p-4 p-md-5">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              ¡Receta creada con éxito! Redirigiendo...
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center gap-2">
                    <FaUtensils className="text-primary" /> Nombre de la Receta
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="title"
                    placeholder="Ej: Empanadas de Carne Salteñas"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Descripción Corta</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    placeholder="Cuéntanos un poco sobre esta receta..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center gap-2">
                    <FaImage className="text-primary" /> URL de la Imagen
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Pega el enlace de una imagen de internet.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Categoría</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Principal">Plato Principal</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Postre">Postre</option>
                    <option value="Merienda">Merienda / Desayuno</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Salsa">Salsa / Aderezo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold d-flex align-items-center gap-2">
                    <FaClock className="text-primary" /> Tiempo (minutos)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="time"
                    placeholder="Ej: 45"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Dificultad</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Media">Media</option>
                    <option value="Difícil">Difícil</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center gap-2">
                    <FaListUl className="text-primary" /> Ingredientes
                  </Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={8}
                    name="ingredients"
                    placeholder="Escribe cada ingrediente en una línea nueva.&#10;Ej:&#10;500g de harina&#10;2 huevos&#10;1 taza de leche"
                    value={formData.ingredients}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Un ingrediente por línea.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center gap-2">
                    <FaBookOpen className="text-primary" /> Instrucciones /
                    Pasos
                  </Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={8}
                    name="instructions"
                    placeholder="Escribe los pasos de la preparación.&#10;1. Mezclar harina con huevos.&#10;2. Amasar por 10 minutos.&#10;..."
                    value={formData.instructions}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate("/recetas")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Publicar Receta"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
