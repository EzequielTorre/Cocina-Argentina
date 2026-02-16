import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { createRecipe } from "../services/supabaseClient";

const emptyForm = {
  title: "",
  description: "",
  category: "Plato Principal",
  time: "",
  difficulty: "Fácil",
  image: "",
  ingredients: "",
  instructions: "",
};

const MyRecipes = () => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Debes iniciar sesión para crear una receta.");
      return;
    }

    if (!form.title || !form.description || !form.instructions) {
      setError("Título, descripción e instrucciones son obligatorios.");
      return;
    }

    try {
      setSubmitting(true);

      const recipePayload = {
        title: form.title,
        description: form.description,
        category: form.category,
        time: form.time ? Number(form.time) : null,
        difficulty: form.difficulty,
        image: form.image || null,
        ingredients: form.ingredients
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean),
        instructions: form.instructions,
        // Campos opcionales si existen en Supabase:
        // status: "pending",
        // created_by: user.id,
      };

      const created = await createRecipe(recipePayload);

      setSuccess(
        "Receta enviada correctamente. Puede requerir aprobación antes de ser visible.",
      );
      setForm(emptyForm);

      if (created?.id) {
        setTimeout(() => {
          navigate(`/receta/${created.id}`);
        }, 1200);
      }
    } catch (err) {
      setError("Hubo un error al crear la receta. Intenta nuevamente.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <h1 className="display-5 fw-bold mb-3 text-center">
            Crear nueva receta
          </h1>
          <p className="text-secondary text-center mb-4">
            Comparte tus propias creaciones con la comunidad de Cocina
            Argentina.
          </p>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="bg-white p-4 rounded-3 shadow-sm">
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej. Empanadas de carne jugosas"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción breve</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Una breve descripción de tu receta"
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>Plato Principal</option>
                    <option>Entrada</option>
                    <option>Postre</option>
                    <option>Bebida</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tiempo (min)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Dificultad</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
                    <option>Fácil</option>
                    <option>Medio</option>
                    <option>Difícil</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL de imagen (opcional)</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredientes (uno por línea)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
                placeholder={"500g de carne picada\n1 cebolla grande\nSal, pimienta..."}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Instrucciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                placeholder={"1. Precalentar el horno a 200°C...\n2. Mezclar los ingredientes..."}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar receta"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MyRecipes;

