import Carousel from "./Carousel";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "./RecipeCard";

const Home = () => {
  const { getRecipes } = useRecipes();
  const recipes = getRecipes().slice(0, 6); // Mostrar primeras 6 recetas

  return (
    <div className="pb-5">
      {/* Hero Section */}
      <section className="py-5 py-md-5">
        <Container>
          <div className="text-center mb-4 mb-md-5">
            <h1 className="display-3 fw-bold text-dark mb-3">
              Sabores de <span className="text-info">Argentina</span>
            </h1>
            <p
              className="lead text-secondary mx-auto"
              style={{ maxWidth: "800px" }}
            >
              Un viaje culinario por nuestra tierra. Tradición, pasión y el
              inconfundible gusto de lo casero.
            </p>
          </div>
          <Carousel />
        </Container>
      </section>

      {/* Mission Section */}
      <section className="bg-body-tertiary py-5 shadow-sm">
        <Container>
          <Row className="align-items-center g-4 g-md-5">
            <Col md={6} className="mb-4 mb-md-0">
              <span className="text-warning fw-bold text-uppercase small ls-2">
                Nuestra Pasión
              </span>
              <h2 className="display-5 fw-bold mb-4">
                Preservando la <br />
                Herencia Culinaria
              </h2>
              <p className="lead text-secondary mb-4">
                Desde las pampas hasta los andes, cada receta cuenta una
                historia. Queremos que redescubras esos domingos en familia, el
                olor a asado, la dulzura de un alfajor y la calidez de nuestra
                gente a través de sus platos.
              </p>
              <div>
                <Button
                  as={Link}
                  to="/recetas"
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-4 py-2 shadow"
                >
                  Explorar Recetario
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <div className="position-relative">
                <div
                  className="rounded-4 overflow-hidden shadow-lg"
                  style={{ height: "400px" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Cocina Argentina"
                    className="w-100 h-100 object-fit-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Recipes */}
      <section className="py-5">
        <Container>
          <h2 className="text-center display-6 fw-bold text-dark mb-5">
            Recetas Destacadas
          </h2>
          <Row className="g-4">
            {recipes.map((recipe) => (
              <Col lg={4} md={6} xs={12} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button
              as={Link}
              to="/recetas"
              variant="outline-primary"
              size="lg"
              className="rounded-pill px-4 py-2"
            >
              Ver Todas las Recetas
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
