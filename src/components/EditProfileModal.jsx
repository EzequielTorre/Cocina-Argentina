import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { upsertUserProfile } from "../services/supabaseClient";

const EditProfileModal = ({ show, onHide, user, currentProfile, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentProfile?.name || user?.fullName || user?.username || "",
    avatar_url: currentProfile?.avatar_url || user?.imageUrl || "",
    bio: currentProfile?.bio || "",
    occupation: currentProfile?.occupation || "",
    contact_email:
      currentProfile?.contact_email ||
      user?.primaryEmailAddress?.emailAddress ||
      "",
    twitter_url: currentProfile?.twitter_url || "",
    instagram_url: currentProfile?.instagram_url || "",
    facebook_url: currentProfile?.facebook_url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProfile = await upsertUserProfile({
        user_id: user.id,
        ...formData,
      });
      onUpdate(updatedProfile);
      onHide();
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert(
        "No se pudo actualizar el perfil. Asegúrate de haber ejecutado el SQL en Supabase.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Editar Mi Perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nombre para mostrar</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre o alias"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  URL de Avatar (Imagen)
                </Form.Label>
                <Form.Control
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ocupación / Oficio</Form.Label>
                <Form.Control
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Ej: Cocinero Amateur, Chef, etc."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Email de contacto</Form.Label>
                <Form.Control
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Sobre mí (Biografía)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos un poco sobre tu pasión por la cocina argentina..."
              style={{ resize: "none" }}
            />
          </Form.Group>

          <hr />
          <h5 className="mb-3 text-primary">Redes Sociales</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Instagram (URL)
                </Form.Label>
                <Form.Control
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/usuario"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  X / Twitter (URL)
                </Form.Label>
                <Form.Control
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  placeholder="https://x.com/usuario"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Facebook (URL)
                </Form.Label>
                <Form.Control
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/usuario"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
