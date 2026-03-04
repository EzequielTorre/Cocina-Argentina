import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./ui/RecipeCardSkeleton";
import { Container, Row, Col, Card, Image, Badge } from "react-bootstrap";
import { FaUser, FaUtensils, FaArrowLeft } from "react-icons/fa";

const UserProfile = () => {
  const { userId } = useParams();
  const { recipes, loading } = useRecipes();
  const [userRecipes, setUserRecipes] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({ name: "", image: "" });

  useEffect(() => {
    if (recipes.length > 0 && userId) {
      const filtered = recipes.filter((r) => r.user_id === userId);
      setUserRecipes(filtered);

      // Intentar obtener info del autor de la primera receta encontrada
      if (filtered.length > 0) {
        setAuthorInfo({
          name: filtered[0].author_name || "Cocinero Argentino",
          image: filtered[0].author_image || "",
        });
      }
    }
  }, [recipes, userId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </Container>
    );
  }

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
        <Card.Body className="px-4 pb-4">
          <div
            className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3"
            style={{ marginTop: "-50px" }}
          >
            {authorInfo.image ? (
              <Image
                src={authorInfo.image}
                roundedCircle
                className="border border-4 border-white shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary border border-4 border-white shadow d-flex align-items-center justify-content-center text-white"
                style={{ width: "120px", height: "120px", fontSize: "3rem" }}
              >
                <FaUser />
              </div>
            )}
            <div className="text-center text-md-start mb-2">
              <h1 className="fw-bold mb-0">{authorInfo.name}</h1>
              <Badge bg="info" className="text-uppercase px-3 py-2 mt-2">
                Cocinero de la Comunidad
              </Badge>
            </div>
          </div>
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
    </Container>
  );
};

export default UserProfile;
