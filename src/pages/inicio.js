import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import keycloak from '../keycloak';

const Inicio = () => {
  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + '/home'
    });
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center"
    >
      <h1 className="mb-4">¡Bienvenido a Bidplace!</h1>
      <div className="d-flex gap-3">
        <Link to="/register">
          <Button variant="primary">Registrarse</Button>
        </Link>
        <Button variant="secondary" onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </div>
    </Container>
  );
};

export default Inicio;
