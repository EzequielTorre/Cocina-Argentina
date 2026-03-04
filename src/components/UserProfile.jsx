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
    <Container className="py-5">
      <Link
        to="/recetas"
        className="btn btn-link text-decoration-none mb-4 d-inline-flex align-items-center gap-2"
      >
        <FaArrowLeft /> Volver al recetario
      </Link>

      <Card className="shadow-sm border-0 mb-5 bg-white overflow-hidden rounded-4">
        <div className="bg-primary py-4"></div>
        <Card.Body className="px-4 pb-4 position-relative">
          {isOwner && (
            <Button
              variant="outline-primary"
              className="position-absolute top-0 end-0 mt-3 me-3 d-flex align-items-center gap-2 rounded-pill"
              onClick={() => setShowEditModal(true)}
            >
              <FaEdit /> Editar Perfil
            </Button>
          )}

          <div
            className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4"
            style={{ marginTop: "-50px" }}
          >
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                roundedCircle
                className="border border-4 border-white shadow"
                style={{
                  width: "130px",
                  height: "130px",
                  objectFit: "cover",
                  aspectRatio: "1/1",
                }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary border border-4 border-white shadow d-flex align-items-center justify-content-center text-white"
                style={{ width: "130px", height: "130px", fontSize: "3.5rem" }}
              >
                <FaUser />
              </div>
            )}
            <div className="text-center text-md-start mb-2 flex-grow-1">
              <h1 className="fw-bold mb-1">{displayName}</h1>
              <Stack
                direction="horizontal"
                gap={3}
                className="justify-content-center justify-content-md-start flex-wrap mb-2"
              >
                <Badge bg="info" className="text-uppercase px-3 py-2">
                  Cocinero de la Comunidad
                </Badge>
                {profile?.occupation && (
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaBriefcase className="text-primary" />{" "}
                    {profile.occupation}
                  </span>
                )}
                {profile?.contact_email && (
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaEnvelope className="text-primary" />{" "}
                    {profile.contact_email}
                  </span>
                )}
              </Stack>
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-4 p-3 bg-light rounded-3 border-start border-primary border-4">
              <p className="mb-0 text-secondary italic">"{profile.bio}"</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <h3 className="mb-4 d-flex align-items-center gap-2">
        <FaUtensils className="text-primary" /> Recetas publicadas (
        {userRecipes.length})
      </h3>

      {userRecipes.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {userRecipes.map((recipe) => (
            <Col key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
          <p className="text-muted lead mb-0">
            Este usuario aún no ha publicado recetas.
          </p>
        </div>
      )}

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
    </Container>
  );
};

export default UserProfile;
