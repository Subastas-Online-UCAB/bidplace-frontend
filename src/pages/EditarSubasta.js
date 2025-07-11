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
  const { id } = useParams();
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

  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar ID de usuario y productos del usuario
  useEffect(() => {
    const fetchDatosUsuarioYProductos = async () => {
      try {
        const email = keycloak.tokenParsed?.email;
        if (!email) return;

        // Obtener ID del usuario
        const userRes = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });

        const userId = userRes.data.id;
        setFormData(prev => ({ ...prev, idUsuario: userId }));

        // Obtener productos del usuario
        const productosRes = await axios.get('http://localhost:5118/productos/api/ProductosControlador', {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });

        const productosFiltrados = productosRes.data.filter(p => p.idUsuario === userId);
        setProductosDisponibles(productosFiltrados);
      } catch (err) {
        console.error("Error al obtener usuario o productos:", err);
        setError("Error al obtener los productos del usuario.");
      }
    };

    fetchDatosUsuarioYProductos();
  }, []);

  // Cargar datos de la subasta actual
  useEffect(() => {
    const fetchSubasta = async () => {
      try {
        const res = await axios.get(`http://localhost:5118/subastas/api/Subastas/buscar/${id}`, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });

        const subasta = res.data;
        setFormData({
          nombre: subasta.titulo,
          descripcion: subasta.descripcion,
          precioBase: subasta.precioBase,
          duracion: parseInt(subasta.duracion),
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
    setFormData(prev => ({ ...prev, idProducto: producto.idProducto }));
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
          {productosDisponibles.length === 0 ? (
            <p>No tienes productos registrados.</p>
          ) : (
            <ul className="list-group">
              {productosDisponibles.map((producto) => (
                <li key={producto.idProducto} className="list-group-item d-flex justify-content-between align-items-center">
                  {producto.nombre}
                  <Button variant="primary" size="sm" onClick={() => seleccionarProducto(producto)}>
                    Seleccionar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EditarSubasta;
