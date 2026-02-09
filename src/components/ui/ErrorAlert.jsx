import { Alert, Container } from "react-bootstrap";

/**
 * Componente para mostrar mensajes de error
 * @param {string} message - Mensaje de error
 * @param {function} onDismiss - Callback cuando se cierra la alerta
 * @param {string} variant - Variante de la alerta ('danger', 'warning', 'info')
 */
export function ErrorAlert({
  message = "Ocurrió un error",
  onDismiss = null,
  variant = "danger",
}) {
  return (
    <Container className="py-4">
      <Alert variant={variant} dismissible={!!onDismiss} onClose={onDismiss}>
        <Alert.Heading>
          ⚠️ {variant === "danger" ? "Error" : "Aviso"}
        </Alert.Heading>
        <p>{message}</p>
      </Alert>
    </Container>
  );
}

export default ErrorAlert;
