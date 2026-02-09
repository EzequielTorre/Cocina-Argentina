import { useState } from "react";
import { Carousel as BootstrapCarousel } from "react-bootstrap";
import recipesData from "./data/recipes.json";

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const featuredRecipes = recipesData.slice(0, 4);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <BootstrapCarousel activeIndex={index} onSelect={handleSelect} className="mb-5 shadow rounded overflow-hidden">
      {featuredRecipes.map((recipe) => (
        <BootstrapCarousel.Item key={recipe.id} style={{ height: '600px' }}>
          <img
            className="d-block w-100 h-100 object-fit-cover"
            src={recipe.image}
            alt={recipe.title}
            style={{ objectFit: 'cover' }}
          />
          <BootstrapCarousel.Caption className="bg-dark bg-opacity-50 rounded p-4 mb-4">
            <span className="badge bg-warning text-dark mb-2 text-uppercase letter-spacing-2">Plato Destacado</span>
            <h3 className="display-4 fw-bold">{recipe.title}</h3>
            <p className="lead">{recipe.description}</p>
          </BootstrapCarousel.Caption>
        </BootstrapCarousel.Item>
      ))}
    </BootstrapCarousel>
  );
};

export default Carousel;
