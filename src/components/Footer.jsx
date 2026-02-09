import { FaHeart, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row className="mb-4 text-center text-md-start">
          <Col md={4} className="mb-4 mb-md-0">
            <h3 className="fw-bold mb-3">Cocina Argentina</h3>
            <p className="text-white-50">
              Celebrando los sabores y tradiciones de nuestra tierra. Recetas auténticas para compartir en familia.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h4 className="fw-bold mb-3 text-warning">Enlaces Rápidos</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-white-50 text-decoration-none hover-white">Inicio</a></li>
              <li className="mb-2"><a href="/recetas" className="text-white-50 text-decoration-none hover-white">Recetas</a></li>
              <li className="mb-2"><a href="/contacto" className="text-white-50 text-decoration-none hover-white">Contacto</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h4 className="fw-bold mb-3 text-warning">Síguenos</h4>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" className="text-white fs-4"><FaInstagram /></a>
              <a href="#" className="text-white fs-4"><FaFacebook /></a>
              <a href="#" className="text-white fs-4"><FaTwitter /></a>
            </div>
          </Col>
        </Row>
        
        <div className="border-top border-secondary pt-4 text-center text-white-50 small">
          <p className="d-flex align-items-center justify-content-center gap-2 mb-0">
            Hecho con <FaHeart className="text-danger" /> por Ezequiel Torres &copy; {year}
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
