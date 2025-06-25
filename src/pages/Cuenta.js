import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Cuenta = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const email = keycloak?.tokenParsed?.email;

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5118/usuarios/api/User/by-email?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`
            }
          }
        );
        setUsuario(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setLoading(false);
      }
    };

    if (email) {
      fetchUsuario();
    }
  }, [email]);

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');

    try {
      await axios.put(
        "http://localhost:5118/usuarios/api/User",
        usuario,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        }
      );
      setMensaje('Datos actualizados exitosamente.');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setMensaje('Hubo un error al actualizar.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">Configuración de la cuenta</h2>

      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            value={usuario.email}
            name="email"
            disabled
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={usuario.nombre}
            name="nombre"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            value={usuario.apellido}
            name="apellido"
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
                value={usuario.telefono}
                name="telefono"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={usuario.direccion}
                name="direccion"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Cuenta;
