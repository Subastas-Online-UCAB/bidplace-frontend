import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import keycloak from '../keycloak';

const categories = [
  'Arte y antigüedades', 'Ropa y accesorios', 'Electrónica', 'Vehículos',
  'Inmuebles', 'Joyería y accesorios', 'Música e instrumentos', 'Libros y coleccionables',
  'Hogar y jardín', 'Juguetes y juegos'
];

const CrearSubasta = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    duracion: '', // en días
    condicionParticipacion: '',
    fechaInicio: '',
    incrementoMinimo: '',
    precioReserva: '',
    tipoSubasta: '',
    idUsuario: '',
    estado: 'Pendiente',
    idProducto: ''
  });

  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = keycloak.tokenParsed?.email;
        if (!email) throw new Error("No se encontró el email en el token");

        const response = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });

        const userId = response.data.id;
        setFormData(prev => ({ ...prev, idUsuario: userId }));

        const responseProductos = await axios.get('http://localhost:5118/productos/api/Productos', {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });

        const productosFiltrados = responseProductos.data.filter(p => p.idUsuario === userId);
        setProductosDisponibles(productosFiltrados);
      } catch (err) {
        console.error("Error al obtener el ID del usuario o los productos:", err);
        setError('No se pudo cargar el usuario o sus productos.');
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarProducto = (producto) => {
    const id = producto.id || producto.idProducto;
    console.log('Producto seleccionado:', id, producto);
    setFormData((prev) => ({ ...prev, idProducto: id }));
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duracionDias = parseInt(formData.duracion, 10);
    const duracionTimeSpan = `${duracionDias}.00:00:00`;

    if (!formData.idProducto) {
      setError('Debes seleccionar un producto antes de crear la subasta.');
      return;
    }

    try {
      const body = {
        ...formData,
        precioBase: parseFloat(formData.precioBase),
        incrementoMinimo: parseFloat(formData.incrementoMinimo),
        precioReserva: parseFloat(formData.precioReserva),
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        duracion: duracionTimeSpan
      };

      console.log("Body enviado:", body);

      await axios.post('http://localhost:5118/subastas/api/Subastas', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`
        }
      });

      setSuccess(true);
       setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
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
            <Form.Select name="tipoSubasta" value={formData.tipoSubasta} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Precio Base</Form.Label>
            <Form.Control name="precioBase" type="number" value={formData.precioBase} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Precio Reserva</Form.Label>
            <Form.Control name="precioReserva" type="number" value={formData.precioReserva} onChange={handleChange} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Incremento Mínimo</Form.Label>
            <Form.Control name="incrementoMinimo" type="number" value={formData.incrementoMinimo} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Duración (días)</Form.Label>
            <Form.Control name="duracion" type="number" value={formData.duracion} onChange={handleChange} required />
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
            {formData.idProducto
              ? `Producto: ${productosDisponibles.find(p => (p.id || p.idProducto) === formData.idProducto)?.nombre || 'Seleccionado'}`
              : 'Seleccionar Producto'}
          </Button>
        </Form.Group>

        <Button type="submit" variant="success" disabled={!formData.idUsuario}>Crear Subasta</Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona un Producto para Subastar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productosDisponibles.length === 0 ? (
            <p className="text-muted">No tienes productos disponibles. Crea uno antes de subastar.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosDisponibles.map((producto) => (
                  <tr key={producto.id || producto.idProducto}>
                    <td>{producto.nombre}</td>
                    <td>{producto.tipo || '—'}</td>
                    <td>{producto.cantidad || 1}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => seleccionarProducto(producto)}>
                        Seleccionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CrearSubasta;
