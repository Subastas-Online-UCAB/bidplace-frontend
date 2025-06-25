import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import keycloak from '../keycloak';
import heroImage from '../pages/img/bid.svg'; // Usa una ilustración SVG moderna

const Inicio = () => {
  const handleLogin = () => {
    keycloak.login({ redirectUri: window.location.origin + '/home' });
  };

  const handlePasswordReset = () => {
    keycloak.login({ action: 'reset' });
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center bg-light">
      <Row className="w-100">
        {/* Texto principal */}
        <Col md={6} className="d-flex flex-column justify-content-center align-items-start px-5">
          <h1 className="display-4 fw-bold text-dark mb-3 animate__animated animate__fadeInLeft">
            ¡Bienvenido a <span className="text-primary">BidPlace</span>!
          </h1>
          <p className="lead text-muted mb-4 animate__animated animate__fadeInLeft">
            La plataforma donde postores y subastadores se encuentran en un espacio seguro y eficiente.
          </p>

          <div className="d-flex flex-column gap-3 w-100 animate__animated animate__fadeInUp">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-100 shadow-sm">
                Registrarse
              </Button>
            </Link>

            <Button variant="outline-primary" size="lg" className="w-100 shadow-sm" onClick={handleLogin}>
              Iniciar sesión
            </Button>

            <Button
              variant="link"
              size="sm"
              className="text-muted text-decoration-none mt-2"
              onClick={handlePasswordReset}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>
        </Col>

        {/* Imagen */}
        <Col md={6} className="d-none d-md-flex justify-content-center align-items-center">
          <img
            src={heroImage}
            alt="Subasta"
            className="img-fluid animate__animated animate__zoomIn"
            style={{ maxHeight: '500px' }}
          />
        </Col>
      </Row>

      {/* Animaciones con Animate.css */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </Container>
  );
};

export default Inicio;
