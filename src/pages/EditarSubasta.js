import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import keycloak from '../keycloak';

const categories = [
  'Arte y antigüedades', 'Ropa y accesorios', 'Electrónica', 'Vehículos',
  'Inmuebles', 'Joyería y accesorios', 'Música e instrumentos', 'Libros y coleccionables',
  'Hogar y jardín', 'Juguetes y juegos'
];

const EditarSubasta = () => {
  const { id } = useParams(); // id de la subasta
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
    idUsuario: '',
    estado: '',
    idProducto: ''
  });

  const [productosDisponibles] = useState([
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', nombre: 'Laptop Dell Inspiron' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', nombre: 'iPhone 13 Pro Max' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', nombre: 'Guitarra Fender Stratocaster' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Obtener ID usuario
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = keycloak.tokenParsed?.email;
        const res = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });
        setFormData(prev => ({ ...prev, idUsuario: res.data.id }));
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        setError("Error al obtener el usuario.");
      }
    };

    fetchUserId();
  }, []);

  // Cargar datos de subasta
  useEffect(() => {
    const fetchSubasta = async () => {
      try {
        const res = await axios.get(`http://localhost:5118/subastas/api/Subastas/buscar/${id}`, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });

        const subasta = res.data;
        console.log(subasta);
        setFormData({
          nombre: subasta.titulo,
          descripcion: subasta.descripcion,
          precioBase: subasta.precioBase,
          duracion: parseInt(subasta.duracion), // formato: "1.00:00:00"
          condicionParticipacion: subasta.condicionParticipacion,
          fechaInicio: subasta.fechaInicio ? subasta.fechaInicio.slice(0, 10) : '',
          incrementoMinimo: subasta.incrementoMinimo,
          precioReserva: subasta.precioReserva,
          tipoSubasta: subasta.tipoSubasta,
          idUsuario: subasta.idUsuario,
          estado: subasta.estado,
          idProducto: subasta.idProducto
        });
      } catch (err) {
        console.error("Error al cargar subasta:", err);
        setError("No se pudo cargar la subasta.");
      }
    };

    fetchSubasta();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const seleccionarProducto = (producto) => {
    setFormData(prev => ({ ...prev, idProducto: producto.id }));
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.put(
      'http://localhost:5118/subastas/api/Subastas/editar',
      {
        subastaId: id,
        usuarioId: formData.idUsuario,
        titulo: formData.nombre,
        descripcion: formData.descripcion,
        fechaCierre: new Date(formData.fechaInicio).toISOString(),
        precioBase: parseFloat(formData.precioBase),
        duracion: `${formData.duracion}.00:00:00`,
        condicionParticipacion: formData.condicionParticipacion,
        incrementoMinimo: parseFloat(formData.incrementoMinimo),
        precioReserva: parseFloat(formData.precioReserva),
        tipoSubasta: formData.tipoSubasta,
        productoId: formData.idProducto
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );

    setSuccess(true);
    setTimeout(() => navigate('/mis-subastas'), 1500);
  } catch (err) {
    console.error(err);
    setError("Error al actualizar la subasta.");
  }
};

  return (
    <Container className="pt-5 mt-5 mb-5">
      <h2 className="mb-4">Editar Subasta</h2>
      {success && <Alert variant="success">Subasta actualizada exitosamente.</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
          </Col>
           <Col md={6}>
            <Form.Label>Tipo de Subasta</Form.Label>
            <Form.Select 
              name="tipoSubasta" 
              value={formData.tipoSubasta} 
              onChange={handleChange} 
              required
            >
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
            {formData.idProducto ? 'Cambiar Producto' : 'Seleccionar Producto'}
          </Button>
        </Form.Group>

        <Button type="submit" variant="success" disabled={!formData.idUsuario}>Guardar Cambios</Button>
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
                <Button variant="primary" size="sm" onClick={() => seleccionarProducto(producto)}>
                  Seleccionar
                </Button>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EditarSubasta;
