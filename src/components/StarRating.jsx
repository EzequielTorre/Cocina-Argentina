import { FaStar } from "react-icons/fa";
import { useState } from "react";

const StarRating = ({
  rating = 0,
  onRatingChange,
  interactive = false,
  size = "lg",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClass =
    {
      sm: "fs-6",
      md: "fs-5",
      lg: "fs-4",
      xl: "fs-3",
    }[size] || "fs-4";

  const displayRating = interactive ? hoverRating || rating : rating;

  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div
      className={`d-flex align-items-center gap-1 ${interactive ? "cursor-pointer" : ""}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`btn p-0 border-0 ${sizeClass}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onTouchStart={() => handleStarHover(star)}
          disabled={!interactive}
          style={{
            cursor: interactive ? "pointer" : "default",
            color:
              star <= displayRating
                ? "#ffc107" // Amarillo para estrellas llenas
                : "#dee2e6", // Gris para estrellas vacías
            transition: "color 0.2s ease",
          }}
          title={
            interactive
              ? `Calificar ${star} estrellas`
              : `${rating} de 5 estrellas`
          }
        >
          <FaStar />
        </button>
      ))}
      {rating > 0 && (
        <span className="text-muted ms-2 small">{rating.toFixed(1)} / 5</span>
      )}
    </div>
  );
};

export default StarRating;
