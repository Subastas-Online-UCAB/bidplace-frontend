import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import keycloak from '../keycloak';

const CrearSubasta = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    duracion: '',
    condicionParticipacion: '',
    fechaInicio: '',
    incrementoMinimo: '',
    precioReserva: '',
    tipoSubasta: '',
    idUsuario: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    estado: 'Pendiente',
    idProducto: '123456789'
  });

  const [productosDisponibles] = useState([
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', nombre: 'Laptop Dell Inspiron' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', nombre: 'iPhone 13 Pro Max' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', nombre: 'Guitarra Fender Stratocaster' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarProducto = (producto) => {
    setFormData((prev) => ({ ...prev, idProducto: producto.id }));
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5118/subastas/api/Subastas',
        {
          ...formData,
          precioBase: parseFloat(formData.precioBase),
          incrementoMinimo: parseFloat(formData.incrementoMinimo),
          precioReserva: parseFloat(formData.precioReserva),
          fechaInicio: new Date(formData.fechaInicio).toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        }
      );
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Ocurrió un error al crear la subasta.');
    }
  };

  return (
    <Container className="pt-5 mt-5 mb-5">
      <h2 className="mb-4">Crear Nueva Subasta</h2>
      {success && <Alert variant="success">Subasta creada exitosamente.</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Tipo de Subasta</Form.Label>
            <Form.Control name="tipoSubasta" value={formData.tipoSubasta} onChange={handleChange} required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Precio Base</Form.Label>
            <Form.Control name="precioBase" type="number" value={formData.precioBase} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Precio Reserva</Form.Label>
            <Form.Control name="precioReserva" type="number" value={formData.precioReserva} onChange={handleChange} required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Incremento Mínimo</Form.Label>
            <Form.Control name="incrementoMinimo" type="number" value={formData.incrementoMinimo} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Duración (días)</Form.Label>
            <Form.Control name="duracion" value={formData.duracion} onChange={handleChange} required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Condición de Participación</Form.Label>
            <Form.Control name="condicionParticipacion" value={formData.condicionParticipacion} onChange={handleChange} required />
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Producto Seleccionado</Form.Label><br />
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            {formData.idProducto ? 'Cambiar Producto' : 'Seleccionar Producto'}
          </Button>
        </Form.Group>

        <Button type="submit" variant="success">Crear Subasta</Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            {productosDisponibles.map((producto) => (
              <li key={producto.id} className="list-group-item d-flex justify-content-between align-items-center">
                {producto.nombre}
                <Button variant="primary" size="sm" onClick={() => seleccionarProducto(producto)}>Seleccionar</Button>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CrearSubasta;
