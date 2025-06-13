import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css'; // Importando archivo de estilo para Login

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  // Función para manejar el reseteo de contraseña (requiere backend)
  const handlePasswordReset = (e) => {
    e.preventDefault();
    alert(`Su contraseña ha sido enviada a ${email}`);
    handleModalClose();

    // Aquí debes llamar al backend para realizar el reseteo de la contraseña
    // Ejemplo: 
    // await fetch('/api/recuperar-contraseña', {
    //   method: 'POST',
    //   body: JSON.stringify({ email }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  };

  // Función de inicio de sesión (requiere backend)
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Llamada al backend para verificar las credenciales
      const response = await fetch('http://localhost:5116/api/login', {  // Aquí va la URL de tu API backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })  // Enviar credenciales al backend
      });

      if (response.ok) {
        const data = await response.json();  // Aquí se obtiene la respuesta del backend
        alert(`Bienvenido ${data.nombreUsuario}`);
        // Aquí puedes manejar el token o sesión del usuario con la respuesta del backend
        // Ejemplo:
        // localStorage.setItem("token", data.token);
        // navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Credenciales incorrectas');  // Manejo de error desde el backend
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al conectar con el servidor');  // Si no se conecta al backend
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow login-card">
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail">
                  <Form.Label className="label">Correo electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Ingresa tu correo" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                    className="mb-3 input-field"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label className="label">Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Ingresa tu contraseña" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="mb-3 input-field"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3 button">
                  Iniciar Sesión
                </Button>

                <div className="text-center">
                  ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                  <br />
                  <Button variant="link" onClick={handleModalShow} className="forgot-password">
                    ¿Se te olvidó la contraseña?
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para recuperación de contraseña */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordReset}>
            <Form.Group controlId="resetEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Ingresa tu correo para recuperar la contraseña"
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                className="mb-3"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Enviar contraseña
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;
