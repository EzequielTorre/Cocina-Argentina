import { Spinner, Container } from "react-bootstrap";

/**
 * Componente para mostrar un indicador de carga
 * @param {string} message - Mensaje a mostrar debajo del spinner
 * @param {string} size - Tamaño del spinner ('sm', 'md', 'lg')
 */
export function LoadingSpinner({ message = "Cargando...", size = "md" }) {
  const spinnerSize = size === "sm" ? "25px" : size === "lg" ? "60px" : "40px";

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner
        animation="border"
        role="status"
        className="text-primary"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <p className="text-muted mt-3">{message}</p>
    </Container>
  );
}

export default LoadingSpinner;
