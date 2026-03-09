import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { useUser } from "@clerk/clerk-react";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./ui/RecipeCardSkeleton";
import EditProfileModal from "./EditProfileModal";
import { getUserProfile } from "../services/supabaseClient";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Badge,
  Button,
  Stack,
} from "react-bootstrap";
import {
  FaUser,
  FaUtensils,
  FaArrowLeft,
  FaEdit,
  FaBriefcase,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useUser();
  const { recipes, loading: recipesLoading } = useRecipes();

  const [userRecipes, setUserRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwner = currentUser?.id === userId;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      setProfile(data);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (recipes.length > 0 && userId) {
      const filtered = recipes.filter((r) => r.user_id === userId);
      setUserRecipes(filtered);
    }
  }, [recipes, userId]);

  if (loading || recipesLoading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </Container>
    );
  }

  // Datos combinados: Prioridad al perfil de Supabase, luego a la info de la primera receta
  const displayName =
    profile?.name || userRecipes[0]?.author_name || "Cocinero Argentino";
  const displayAvatar =
    profile?.avatar_url || userRecipes[0]?.author_image || "";

  return (
    <div className="bg-light min-vh-100">
      {/* Banner / Hero Section */}
      <div
        className="position-relative"
        style={{
          height: "250px",
          background: "linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <Container className="h-100 position-relative">
          <Link
            to="/recetas"
            className="btn btn-link text-white text-decoration-none position-absolute top-0 start-0 mt-4 d-flex align-items-center gap-2 hover-opacity"
          >
            <FaArrowLeft /> Volver al recetario
          </Link>
        </Container>
      </div>

      <Container
        style={{ marginTop: "-100px" }}
        className="pb-5 position-relative z-2"
      >
        <Row className="g-4">
          {/* Columna Izquierda: Perfil */}
          <Col lg={4}>
            <Card
              className="shadow-lg border-0 rounded-4 overflow-hidden sticky-top"
              style={{ top: "100px" }}
            >
              <Card.Body className="p-4 text-center">
                <div className="mb-4 position-relative d-inline-block">
                  {displayAvatar ? (
                    <Image
                      src={displayAvatar}
                      roundedCircle
                      className="border border-5 border-white shadow-sm"
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "cover",
                        aspectRatio: "1/1",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary border border-5 border-white shadow-sm d-flex align-items-center justify-content-center text-white mx-auto"
                      style={{
                        width: "160px",
                        height: "160px",
                        fontSize: "4rem",
                      }}
                    >
                      <FaUser />
                    </div>
                  )}
                  {isOwner && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow"
                      onClick={() => setShowEditModal(true)}
                      title="Editar foto"
                    >
                      <FaEdit />
                    </Button>
                  )}
                </div>

                <h2 className="fw-bold mb-1">{displayName}</h2>
                <p className="text-muted mb-3 d-flex align-items-center justify-content-center gap-2">
                  <FaBriefcase className="text-info" />{" "}
                  {profile?.occupation || "Cocinero Apasionado"}
                </p>

                <div className="d-flex justify-content-center gap-2 mb-4">
                  <Badge bg="info" className="px-3 py-2 rounded-pill">
                    {userRecipes.length} Recetas
                  </Badge>
                  <Badge
                    bg="warning"
                    className="text-dark px-3 py-2 rounded-pill"
                  >
                    Chef Nivel 1
                  </Badge>
                </div>

                {profile?.bio && (
                  <div className="bg-light p-3 rounded-3 mb-4 text-start">
                    <p
                      className="mb-0 text-secondary small"
                      style={{ fontStyle: "italic" }}
                    >
                      "{profile.bio}"
                    </p>
                  </div>
                )}

                <div className="d-grid gap-2 mb-4">
                  {profile?.contact_email && (
                    <Button
                      href={`mailto:${profile.contact_email}`}
                      variant="outline-primary"
                      className="rounded-pill d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaEnvelope /> Contactar
                    </Button>
                  )}
                  {isOwner && (
                    <Button
                      variant="primary"
                      className="rounded-pill d-flex align-items-center justify-content-center gap-2"
                      onClick={() => setShowEditModal(true)}
                    >
                      <FaEdit /> Editar Perfil Completo
                    </Button>
                  )}
                </div>

                {/* Redes Sociales */}
                {(profile?.instagram_url ||
                  profile?.twitter_url ||
                  profile?.facebook_url) && (
                  <div className="pt-3 border-top">
                    <h6 className="text-uppercase small fw-bold text-muted mb-3">
                      Redes Sociales
                    </h6>
                    <Stack
                      direction="horizontal"
                      gap={3}
                      className="justify-content-center"
                    >
                      {profile.instagram_url && (
                        <a
                          href={profile.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-danger fs-4 transition-hover"
                        >
                          <FaInstagram />
                        </a>
                      )}
                      {profile.twitter_url && (
                        <a
                          href={profile.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark fs-4 transition-hover"
                        >
                          <FaTwitter />
                        </a>
                      )}
                      {profile.facebook_url && (
                        <a
                          href={profile.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary fs-4 transition-hover"
                        >
                          <FaFacebook />
                        </a>
                      )}
                    </Stack>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Columna Derecha: Recetas */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaUtensils className="text-primary" /> Recetas Publicadas
              </h3>
              <span className="text-muted small">
                Mostrando {userRecipes.length} resultados
              </span>
            </div>

            {userRecipes.length > 0 ? (
              <Row xs={1} md={2} className="g-4">
                {userRecipes.map((recipe) => (
                  <Col key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center py-5 border-0 shadow-sm rounded-4 bg-white">
                <Card.Body>
                  <div className="text-muted mb-3">
                    <FaUtensils size={48} className="opacity-25" />
                  </div>
                  <h4 className="text-muted">
                    Este usuario aún no ha publicado recetas
                  </h4>
                  <p className="text-secondary mb-4">
                    ¡Anímalo a compartir su primer plato!
                  </p>
                  {isOwner && (
                    <Button
                      as={Link}
                      to="/mis-recetas"
                      variant="primary"
                      className="rounded-pill px-4"
                    >
                      Publicar mi primera receta
                    </Button>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Modal de edición */}
      {isOwner && (
        <EditProfileModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          user={currentUser}
          currentProfile={profile}
          onUpdate={(updated) => setProfile(updated)}
        />
      )}
    </div>
  );
};

export default UserProfile;
