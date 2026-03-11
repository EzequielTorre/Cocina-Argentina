import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { 
  Container, Row, Col, Card, Table, Button, Badge, 
  Tabs, Tab, Alert, Spinner, Image 
} from "react-bootstrap";
import { 
  FaTrash, FaStar, FaCheck, FaTimes, FaComments, 
  FaUtensils, FaShieldAlt, FaExternalLinkAlt 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { 
  getRecipes, 
  getAllComments, 
  adminDeleteComment, 
  toggleFeaturedRecipe,
  deleteRecipe
} from "../services/supabaseClient";

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Email del administrador (Ezequiel)
  const ADMIN_EMAIL = "ezequiel.torres0682@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (isLoaded && isAdmin) {
      fetchData();
    }
  }, [isLoaded, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recipesData, commentsData] = await Promise.all([
        getRecipes(),
        getAllComments()
      ]);
      setRecipes(recipesData);
      setComments(commentsData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("No se pudieron cargar los datos del panel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) return;
    
    try {
      setActionLoading(`comment-${commentId}`);
      await adminDeleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert("Error al eliminar el comentario");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (recipeId, currentStatus) => {
    try {
      setActionLoading(`recipe-${recipeId}`);
      await toggleFeaturedRecipe(recipeId, !currentStatus);
      setRecipes(recipes.map(r => 
        r.id === recipeId ? { ...r, is_featured: !currentStatus } : r
      ));
    } catch (err) {
      alert("Error al actualizar estado de destacada");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta receta? Esta acción es irreversible.")) return;
    
    try {
      setActionLoading(`delete-recipe-${recipeId}`);
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (err) {
      alert("Error al eliminar la receta");
    } finally {
      setActionLoading(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando panel de administración...</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center py-5">
          <FaShieldAlt size={50} className="mb-3" />
          <h3>Acceso Denegado</h3>
          <p>No tienes permisos para acceder a esta sección.</p>
          <Button as={Link} to="/" variant="primary" className="mt-3 rounded-pill px-4">
            Volver al Inicio
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center gap-3 mb-5">
        <div className="bg-primary text-white p-3 rounded-4 shadow-sm">
          <FaShieldAlt size={30} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Panel de Administración</h2>
          <p className="text-secondary mb-0">Gestiona recetas, comentarios y contenido destacado</p>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="recipes" id="admin-tabs" className="mb-4 custom-tabs">
        {/* TAB RECETAS */}
        <Tab eventKey="recipes" title={<span><FaUtensils className="me-2" /> Recetas</span>}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Receta</th>
                    <th>Autor</th>
                    <th>Categoría</th>
                    <th className="text-center">Destacada</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <Image 
                            src={recipe.image} 
                            rounded 
                            style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                          />
                          <div>
                            <div className="fw-bold">{recipe.title}</div>
                            <small className="text-muted">ID: {recipe.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{recipe.author_name}</td>
                      <td>
                        <Badge bg="info" className="fw-normal">{recipe.category}</Badge>
                      </td>
                      <td className="text-center">
                        <Button 
                          variant={recipe.is_featured ? "warning" : "outline-secondary"}
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleToggleFeatured(recipe.id, recipe.is_featured)}
                          disabled={actionLoading === `recipe-${recipe.id}`}
                        >
                          {actionLoading === `recipe-${recipe.id}` ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaStar color={recipe.is_featured ? "white" : "currentColor"} />
                          )}
                        </Button>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button 
                            as={Link} 
                            to={`/receta/${recipe.id}`} 
                            variant="light" 
                            size="sm"
                            className="rounded-circle p-2"
                            title="Ver receta"
                          >
                            <FaExternalLinkAlt size={14} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            className="rounded-circle p-2"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            disabled={actionLoading === `delete-recipe-${recipe.id}`}
                            title="Eliminar receta"
                          >
                            <FaTrash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Tab>

        {/* TAB COMENTARIOS */}
        <Tab eventKey="comments" title={<span><FaComments className="me-2" /> Comentarios</span>}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Usuario</th>
                    <th>Comentario</th>
                    <th>Receta</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Image 
                            src={comment.user_image} 
                            roundedCircle 
                            style={{ width: "30px", height: "30px", objectFit: "cover" }} 
                          />
                          <span className="small fw-bold">{comment.user_name}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: "300px" }}>
                        <p className="small mb-0 text-truncate-2">{comment.content}</p>
                        <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {new Date(comment.created_at).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {comment.recipes?.title || "Receta eliminada"}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="rounded-circle p-2"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={actionLoading === `comment-${comment.id}`}
                          title="Eliminar comentario"
                        >
                          {actionLoading === `comment-${comment.id}` ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaTrash size={14} />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Tab>
      </Tabs>

      <style>{`
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .custom-tabs .nav-link {
          border: none;
          color: var(--bs-secondary);
          padding: 1rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .custom-tabs .nav-link.active {
          color: var(--bs-primary);
          background: transparent;
          border-bottom: 3px solid var(--bs-primary);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;
