import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const roles = {
    postor: '93674125-19d4-4a5a-a8b7-bdd09c6902f5',
    subastador: '6daa373b-e47b-4c67-8720-a950e046df9f'
  }

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    rolSeleccionado: 'postor'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      direccion: formData.direccion,
      rolId: roles[formData.rolSeleccionado]
    };

    try {
      const response = await fetch('http://localhost:5118/usuarios/api/User/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        const errorData = await response.json();
        alert(`Error al registrarse: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Hubo un error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg border-0 rounded-4">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">Crea tu cuenta</h2>
              <Form onSubmit={handleSubmit}>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        placeholder="Ingresa tu nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        placeholder="Ingresa tu apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="correo@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Crea una contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefono"
                        placeholder="Ej: 04141234567"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        placeholder="Ciudad, Calle, N°"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Tipo de usuario</Form.Label>
                  <Form.Select
                    name="rolSeleccionado"
                    value={formData.rolSeleccionado}
                    onChange={handleChange}
                    required
                  >
                    <option value="postor">Postor</option>
                    <option value="subastador">Subastador</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Registrando...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </Button>

                <div className="text-center mt-3">
                  ¿Ya tienes cuenta? <Link to="/Inicio">Inicia sesión</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL de éxito */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registro exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¡Tu cuenta ha sido creada correctamente!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Register;
