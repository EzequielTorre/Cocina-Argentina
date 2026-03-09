import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  getComments,
  addComment,
  deleteComment,
  createNotification,
} from "../services/supabaseClient";
import { sendAdminAlert } from "../services/emailService";
import { useRecipes } from "../context/RecipeContext";
import {
  Form,
  Button,
  Card,
  Image,
  Stack,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaTrash, FaCommentAlt, FaPaperPlane } from "react-icons/fa";

const RecipeComments = ({ recipeId }) => {
  const { user } = useUser();
  const { getRecipeById } = useRecipes();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(recipeId);
      setComments(data);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
      setError("No se pudieron cargar los comentarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipeId) {
      fetchComments();
    }
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const commentData = {
        recipeId,
        userId: user.id,
        userName: user.fullName || user.username || "Cocinero",
        userImage: user.imageUrl,
        content: newComment,
      };

      const added = await addComment(commentData);
      setComments([added, ...comments]);
      setNewComment("");

      // Notificar al dueño de la receta
      const recipe = await getRecipeById(recipeId);
      if (recipe && recipe.user_id && recipe.user_id !== user.id) {
        await createNotification({
          userId: recipe.user_id,
          type: "comment",
          content: `${user.fullName || user.username} comentó en tu receta: "${recipe.title}"`,
          recipeId: recipe.id,
          fromUserName: user.fullName || user.username,
        });
      }

      // Alerta de email para el administrador (Ezequiel)
      await sendAdminAlert("comment", {
        recipe_title: recipe?.title || "Receta desconocida",
        comment_content: newComment,
        from_name: user.fullName || user.username,
        from_email: user.primaryEmailAddress?.emailAddress,
      });

      setNewComment("");
    } catch (err) {
      console.error("Error al añadir comentario:", err);
      setError(
        "No se pudo publicar el comentario. ¿Ejecutaste el SQL en Supabase?",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar tu comentario?"))
      return;

    try {
      await deleteComment(commentId, user.id);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      setError("No se pudo eliminar el comentario.");
    }
  };

  return (
    <div className="mt-5 border-top pt-5">
      <h3 className="mb-4 d-flex align-items-center gap-2">
        <FaCommentAlt className="text-primary" /> Comunidad y Opiniones
      </h3>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Formulario para comentar */}
      {user ? (
        <Card className="mb-4 shadow-sm border-0 bg-light">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Stack
                direction="horizontal"
                gap={3}
                className="align-items-start"
              >
                <Image
                  src={user.imageUrl}
                  roundedCircle
                  style={{
                    width: "45px",
                    height: "45px",
                    objectFit: "cover",
                    aspectRatio: "1/1",
                  }}
                  className="border flex-shrink-0"
                />
                <div className="flex-grow-1">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Comparte tu experiencia con esta receta..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    className="border-0 shadow-none"
                    style={{ resize: "none" }}
                  />
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting || !newComment.trim()}
                      className="d-flex align-items-center gap-2 px-4 rounded-pill"
                    >
                      {submitting ? <Spinner size="sm" /> : <FaPaperPlane />}
                      Publicar
                    </Button>
                  </div>
                </div>
              </Stack>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info" className="mb-4 border-0 shadow-sm">
          Debes iniciar sesión para dejar un comentario.
        </Alert>
      )}

      {/* Lista de comentarios */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : comments.length > 0 ? (
        <Stack gap={4}>
          {comments.map((comment) => (
            <div key={comment.id} className="d-flex gap-3">
              <Image
                src={comment.user_image || "https://via.placeholder.com/40"}
                roundedCircle
                style={{
                  width: "45px",
                  height: "45px",
                  objectFit: "cover",
                  aspectRatio: "1/1",
                }}
                className="border shadow-sm flex-shrink-0"
              />
              <div className="flex-grow-1">
                <div className="bg-white p-3 rounded-4 shadow-sm border">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Link
                      to={`/perfil/${comment.user_id}`}
                      className="text-decoration-none"
                    >
                      <span className="fw-bold text-dark hover-primary">
                        {comment.user_name}
                      </span>
                    </Link>
                    <span className="text-muted small">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-0 text-secondary">{comment.content}</p>
                </div>
                {user && user.id === comment.user_id && (
                  <Button
                    variant="link"
                    className="text-danger p-0 mt-1 small text-decoration-none d-flex align-items-center gap-1"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <FaTrash size={12} /> Eliminar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Stack>
      ) : (
        <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
          <p className="mb-0">¡Sé el primero en comentar esta receta!</p>
        </div>
      )}
    </div>
  );
};

export default RecipeComments;
