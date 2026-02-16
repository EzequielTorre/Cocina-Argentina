import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaFire, FaSun, FaMoon, FaHeart, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Navbar
      bg={theme === "dark" ? "dark" : "white"}
      variant={theme}
      expand="lg"
      sticky="top"
      className="shadow-sm transition-all"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <div
            className={`rounded-circle p-2 d-flex justify-content-center align-items-center ${
              theme === "dark" ? "bg-white text-dark" : "bg-dark text-white"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            <FaFire />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold lh-1">COCINA</span>
            <small
              className="text-info text-uppercase"
              style={{ fontSize: "0.65rem", letterSpacing: "2px" }}
            >
              Argentina
            </small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Inicio
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/recetas"
              active={location.pathname === "/recetas"}
            >
              Recetas
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contacto"
              active={location.pathname === "/contacto"}
            >
              Contacto
            </Nav.Link>
            <SignedIn>
              <Nav.Link
                as={Link}
                to="/favoritos"
                active={location.pathname === "/favoritos"}
                className="d-flex align-items-center gap-1"
              >
                <FaHeart className="text-danger" /> Favoritos
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/mis-recetas"
                active={location.pathname === "/mis-recetas"}
                className="d-flex align-items-center gap-1"
              >
                <FaPlus /> Mis recetas
              </Nav.Link>
            </SignedIn>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <Button
              variant="link"
              onClick={toggleTheme}
              className="p-0 border-0 text-decoration-none"
              title={
                theme === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
              }
            >
              {theme === "dark" ? (
                <FaSun className="text-warning fs-5" />
              ) : (
                <FaMoon className="text-secondary fs-5" />
              )}
            </Button>

            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button
                as={Link}
                to="/login"
                variant={theme === "dark" ? "outline-light" : "outline-primary"}
                className="rounded-pill px-4"
              >
                Ingresar
              </Button>
              <Button
                as={Link}
                to="/registro"
                variant={
                  theme === "dark" ? "outline-light" : "outline-secondary"
                }
                className="rounded-pill px-4"
              >
                Registrarse
              </Button>
            </SignedOut>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
