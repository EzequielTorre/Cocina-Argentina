import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * Componente para mostrar cuando no hay datos disponibles
 * @param {string} title - Título principal
 * @param {string} message - Mensaje descriptivo
 * @param {string} actionText - Texto del botón de acción
 * @param {string} actionLink - Ruta del botón de acción
 */
export function EmptyState({
  title = "No hay resultados",
  message = "Intenta con otros términos de búsqueda",
  actionText = "Volver",
  actionLink = "/",
}) {
  return (
    <Container className="py-5 text-center">
      <div className="mb-4">
        <h2 className="display-6 fw-bold text-dark mb-3">{title}</h2>
        <p className="lead text-muted">{message}</p>
      </div>
      <Button
        as={Link}
        to={actionLink}
        variant="primary"
        size="lg"
        className="rounded-pill px-4"
      >
        {actionText}
      </Button>
    </Container>
  );
}

export default EmptyState;
