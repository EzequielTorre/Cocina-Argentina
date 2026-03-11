import {
  FaHeart,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTiktok,
  FaEnvelope,
  FaFire,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  const adminEmail = "ezequiel.torres0682@gmail.com";

  const socialLinks = [
    {
      icon: <FaInstagram />,
      url: "https://www.instagram.com/ezequielmauriciotorres/",
      color: "#E1306C",
      label: "Instagram",
    },
    {
      icon: <FaGithub />,
      url: "https://github.com/EzequielTorre",
      color: "#333",
      label: "GitHub",
    },
    {
      icon: <FaLinkedin />,
      url: "https://www.linkedin.com/in/ezequiel-torres-671094283/",
      color: "#0077B5",
      label: "LinkedIn",
    },
    {
      icon: <FaTwitter />,
      url: "https://x.com/torres0682",
      color: "#1DA1F2",
      label: "X (Twitter)",
    },
    {
      icon: <FaTiktok />,
      url: "https://www.tiktok.com/@ezequieltorres0682/",
      color: "#000000",
      label: "TikTok",
    },
  ];

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto border-top border-secondary border-opacity-25">
      <Container>
        <Row className="gy-4 mb-5">
          {/* Brand Section */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <div
                className="bg-white text-dark rounded-circle p-2 d-flex justify-content-center align-items-center"
                style={{ width: "35px", height: "35px" }}
              >
                <FaFire size={18} />
              </div>
              <div className="d-flex flex-column">
                <span className="fw-bold lh-1 h5 mb-0">COCINA</span>
                <small
                  className="text-info text-uppercase fw-bold"
                  style={{ fontSize: "0.6rem", letterSpacing: "2px" }}
                >
                  Argentina
                </small>
              </div>
            </div>
            <p className="text-white-50 mb-4 pe-lg-4">
              Celebrando los sabores y tradiciones de nuestra tierra. Recetas
              auténticas creadas por la comunidad para compartir el amor por la
              cocina.
            </p>
            <div className="d-flex gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-25 text-white text-decoration-none transition-all hover-lift"
                  style={{ width: "38px", height: "38px" }}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="ps-lg-5">
            <h5 className="fw-bold mb-4 position-relative pb-2 after-underline">
              Navegación
            </h5>
            <Nav className="flex-column gap-2">
              <Nav.Link
                as={Link}
                to="/"
                className="p-0 text-white-50 hover-info transition-all"
              >
                Inicio
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/recetas"
                className="p-0 text-white-50 hover-info transition-all"
              >
                Recetas
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contacto"
                className="p-0 text-white-50 hover-info transition-all"
              >
                Contacto
              </Nav.Link>
            </Nav>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4 position-relative pb-2 after-underline">
              Contacto
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-3 text-white-50">
              <li className="d-flex align-items-start gap-3">
                <FaMapMarkerAlt className="text-info mt-1" />
                <span>Pico Truncado, Santa Cruz, Argentina</span>
              </li>
              <li className="d-flex align-items-start gap-3">
                <FaEnvelope className="text-info mt-1" />
                <Link
                  to="/contacto"
                  className="text-white-50 text-decoration-none hover-info"
                >
                  {adminEmail}
                </Link>
              </li>
              <li className="d-flex align-items-start gap-3">
                <FaPhoneAlt className="text-info mt-1" />
                <span>+54 (11) Comunidad Activa</span>
              </li>
            </ul>
          </Col>

          {/* Newsletter / CTA */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4 position-relative pb-2 after-underline">
              Comunidad
            </h5>
            <p className="text-white-50 small mb-4">
              ¿Tienes una receta familiar secreta? Únete a nosotros y compártela
              con todo el país.
            </p>
            <Link
              to="/mis-recetas"
              className="btn btn-outline-info btn-sm rounded-pill px-4 transition-all hover-lift"
            >
              Subir mi receta
            </Link>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="border-top border-secondary border-opacity-25 pt-4">
          <Row className="align-items-center gy-3">
            <Col md={6} className="text-center text-md-start">
              <p className="text-white-50 small mb-0">
                &copy; {year} Cocina Argentina. Todos los derechos reservados.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="text-white-50 small mb-0 d-flex align-items-center justify-content-center justify-content-md-end gap-2">
                Hecho con <FaHeart className="text-danger animate-pulse" /> por{" "}
                <span className="text-white fw-bold">Ezequiel Torres</span>
              </p>
            </Col>
          </Row>
        </div>
      </Container>

      <style>{`
        .after-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 30px;
          height: 2px;
          background-color: var(--bs-info);
        }
        .hover-info:hover {
          color: var(--bs-info) !important;
          transform: translateX(5px);
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
