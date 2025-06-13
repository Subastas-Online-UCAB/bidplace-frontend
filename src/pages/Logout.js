// Importación de React y los componentes necesarios de react-bootstrap y react-icons
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Componentes para maquetación y grid de Bootstrap
import { BsCheckCircleFill } from 'react-icons/bs'; // Ícono de un círculo verde con marca de verificación

// Componente Logout
const Logout = () => {
  return (
    // Contenedor principal de la página, se centra vertical y horizontalmente
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {/* Fila para contener el contenido */}
      <Row>
        {/* Columna centrada para mostrar el contenido */}
        <Col className="text-center">
          {/* Ícono que indica éxito (marca de verificación verde) */}
          <BsCheckCircleFill size={120} color="green" className="mb-4" />
          
          {/* Título de la página */}
          <h1 className="fw-bold">Sesión Cerrada</h1>
          
          {/* Mensaje que informa al usuario sobre el estado de la sesión */}
          <p className="text-muted fs-5 mt-3">
            Usted ha cerrado sesión satisfactoriamente.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

// Exportación del componente para ser utilizado en otras partes de la aplicación
export default Logout;
