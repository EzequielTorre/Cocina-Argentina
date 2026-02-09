import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FaPaperPlane, FaEnvelope, FaUser, FaCommentAlt } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
} from "react-bootstrap";
import {
  isValidEmail,
  isValidName,
  isValidMessage,
  errorMessages,
} from "../utils/validators";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida los datos del formulario usando funciones globales
   * @returns {Object} Objeto con errores encontrados
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = errorMessages.name.required;
    } else if (!isValidName(formData.name, 3, 50)) {
      newErrors.name =
        formData.name.trim().length < 3
          ? errorMessages.name.tooShort
          : errorMessages.name.tooLong;
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = errorMessages.email.required;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = errorMessages.email.invalid;
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = errorMessages.message.required;
    } else if (!isValidMessage(formData.message, 10, 500)) {
      newErrors.message =
        formData.message.trim().length < 10
          ? errorMessages.message.tooShort
          : errorMessages.message.tooLong;
    }

    return newErrors;
  };

  /**
   * Guarda el mensaje en localStorage
   */
  const saveMessageToLocalStorage = () => {
    try {
      const existingMessages = JSON.parse(
        localStorage.getItem("contactMessages") || "[]",
      );
      const newMessage = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString(),
      };
      existingMessages.push(newMessage);
      localStorage.setItem("contactMessages", JSON.stringify(existingMessages));
      console.log("✅ Mensaje guardado en localStorage:", newMessage);
    } catch (error) {
      console.error("❌ Error al guardar en localStorage:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus(null);

    // Validar formulario
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitStatus("error");
      return;
    }

    setIsLoading(true);

    try {
      // Envío real con EmailJS (cliente)
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
      } else {
        // Si no está configurado EmailJS, guardar localmente para no perder el mensaje
        console.warn(
          "EmailJS no está configurado. Guardando mensaje en localStorage.",
        );
      }

      saveMessageToLocalStorage();

      // Mostrar éxito
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Auto-limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error al enviar:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpiar error de este campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-4 mb-md-5">
        <h2 className="display-4 fw-bold mb-3">Contáctanos</h2>
        <p
          className="lead text-secondary mx-auto"
          style={{ maxWidth: "700px" }}
        >
          ¿Tienes alguna duda sobre una receta? ¿Quieres sugerir un plato
          tradicional? Estamos aquí para escucharte.
        </p>
      </div>

      <Card className="shadow-lg border-0 overflow-hidden rounded-4">
        <Row className="g-0">
          <Col
            md={5}
            className="bg-dark text-white p-5 d-flex flex-column justify-content-between position-relative"
          >
            <div className="position-relative z-1">
              <h3 className="h2 fw-bold mb-4">Información</h3>
              <div className="mb-4">
                <p className="d-flex align-items-center gap-3 text-white-50">
                  <FaEnvelope /> ezequiel.torres0682@gmail.com
                </p>
                <p className="small text-white-50 mt-4">
                  Respondemos todos los mensajes dentro de las 24hs hábiles. Tu
                  opinión es muy importante para nosotros.
                </p>
              </div>
            </div>
            {/* Decorative circles */}
            <div
              className="position-absolute top-0 end-0 bg-secondary rounded-circle opacity-25"
              style={{
                width: "150px",
                height: "150px",
                margin: "-50px -50px 0 0",
                filter: "blur(40px)",
              }}
            ></div>
            <div
              className="position-absolute bottom-0 start-0 bg-primary rounded-circle opacity-25"
              style={{
                width: "150px",
                height: "150px",
                margin: "0 0 -50px -50px",
                filter: "blur(40px)",
              }}
            ></div>
          </Col>

          <Col md={7} className="p-5">
            {/* Mostrar alertas de estado */}
            {submitStatus === "success" && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setSubmitStatus(null)}
              >
                ✅ ¡Mensaje enviado correctamente! Nos pondremos en contacto
                pronto.
              </Alert>
            )}
            {submitStatus === "error" && Object.keys(errors).length > 0 && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setSubmitStatus(null)}
              >
                ⚠️ Por favor, corrige los errores en el formulario.
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="name">
                <Form.Label className="fw-bold small text-secondary">
                  Nombre <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-body-secondary border-end-0">
                    <FaUser className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className={`border-start-0 bg-body-secondary ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    disabled={isLoading}
                  />
                </InputGroup>
                {errors.name && (
                  <Form.Text className="text-danger d-block mt-2">
                    {errors.name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-4" controlId="email">
                <Form.Label className="fw-bold small text-secondary">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-body-secondary border-end-0">
                    <FaEnvelope className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    className={`border-start-0 bg-body-secondary ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    disabled={isLoading}
                  />
                </InputGroup>
                {errors.email && (
                  <Form.Text className="text-danger d-block mt-2">
                    {errors.email}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-4" controlId="message">
                <Form.Label className="fw-bold small text-secondary">
                  Mensaje <span className="text-danger">*</span>
                  <span className="text-muted small ms-2">
                    ({formData.message.length}/500)
                  </span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-body-secondary border-end-0 align-items-start pt-3">
                    <FaCommentAlt className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    className={`border-start-0 bg-body-secondary ${
                      errors.message ? "is-invalid" : ""
                    }`}
                    disabled={isLoading}
                  />
                </InputGroup>
                {errors.message && (
                  <Form.Text className="text-danger d-block mt-2">
                    {errors.message}
                  </Form.Text>
                )}
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="rounded-pill fw-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Mensaje"}
                  <FaPaperPlane className="ms-2" />
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Contact;
