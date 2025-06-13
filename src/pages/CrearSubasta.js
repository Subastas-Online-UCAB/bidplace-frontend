import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * Componente para crear una nueva subasta
 */
const CrearSubasta = () => {
  const navigate = useNavigate();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    precioReserva: '',
    fechaInicio: '',
    fechaFin: '',
    montoBase: '',
    incrementoMinimo: '',
    categoria: '',
    descripcion: ''
  });

  // Estado para los productos disponibles según la categoría
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  // Estado para los productos seleccionados para la subasta
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Estado para mostrar u ocultar el modal de productos
  const [showModal, setShowModal] = useState(false);

  // Productos disponibles para cada categoría
  const productosPorCategoria = {
    'Arte y antiguedades': ['Pintura', 'Escultura', 'Antigüedades', 'Cerámica', 'Fotografías', 'Grabados'],
    'Ropa y accesorios': ['Camisa', 'Pantalón', 'Zapatos', 'Cinturón', 'Sombrero', 'Bufanda'],
    'Electronica': ['Laptop', 'Smartphone', 'Tablet', 'Televisor', 'Auriculares', 'Cámara'],
    'Vehiculos': ['Carro', 'Moto', 'Bicicleta', 'Camión', 'Scooter', 'Barco'],
    'Inmuebles': ['Casa', 'Departamento', 'Oficina', 'Terreno', 'Local comercial', 'Bodega'],
    'Joyeria y accesorios': ['Collar', 'Anillo', 'Pulsera', 'Aretes', 'Reloj', 'Broche'],
    'Musica e instrumentos': ['Guitarra', 'Piano', 'Batería', 'Violín', 'Micrófono', 'Bajo eléctrico'],
    'Libros y coleccionables': ['Libro antiguo', 'Moneda antigua', 'Cómics', 'Carteles', 'Figuras de colección', 'Revistas'],
    'Hogar y jardin': ['Sillón', 'Mesa de jardín', 'Parrillera', 'Macetas', 'Lámparas', 'Cortinas'],
    'Juguetes y juegos': ['Rompecabezas', 'Muñeca', 'Carrito', 'LEGO', 'Videojuegos', 'Peluches']
  };

  /**
   * Efecto que actualiza los productos disponibles al cambiar de categoría
   */
  useEffect(() => {
    if (formData.categoria) {
      const productos = productosPorCategoria[formData.categoria] || [];
      setProductosDisponibles(productos);
      setProductosSeleccionados([]); // Ya no se preseleccionan productos
    } else {
      setProductosDisponibles([]);
      setProductosSeleccionados([]);
    }
  }, [formData.categoria]);

  /**
   * Maneja los cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Añade o quita un producto de la selección
   */
  const toggleProducto = (producto) => {
    setProductosSeleccionados((prev) =>
      prev.includes(producto) ? prev.filter(p => p !== producto) : [...prev, producto]
    );
  };

  /**
   * Elimina un producto de la lista seleccionada
   */
  const eliminarProducto = (producto) => {
    setProductosSeleccionados((prev) => prev.filter(p => p !== producto));
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subasta creada:', formData, productosSeleccionados);
    navigate('/');
  };

  return (
    <Container className="my-5">
      <h2>Crear Nueva Subasta</h2>
      <Form onSubmit={handleSubmit}>
        {/* Inputs principales */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Nombre de la Subasta</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Precio de Reserva</Form.Label>
            <Form.Control name="precioReserva" value={formData.precioReserva} onChange={handleChange} required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Fecha de Fin</Form.Label>
            <Form.Control type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Monto Base</Form.Label>
            <Form.Control name="montoBase" value={formData.montoBase} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label>Incremento Mínimo</Form.Label>
            <Form.Control name="incrementoMinimo" value={formData.incrementoMinimo} onChange={handleChange} required />
          </Col>
        </Row>

        {/* Selección de Categoría */}
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">Seleccione categoría</option>
            {Object.keys(productosPorCategoria).map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Descripción */}
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </Form.Group>

        {/* Botón para abrir el modal de productos */}
        <div className="mb-3">
          <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
            <i className="bi bi-plus"></i> Agregar Productos
          </Button>
        </div>

        {/* Tabla de productos seleccionados */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosSeleccionados.map((producto, idx) => (
              <tr key={idx}>
                <td>{producto}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => eliminarProducto(producto)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Botón para crear subasta */}
        <Button type="submit" variant="success" className="mt-3">Crear Subasta</Button>
      </Form>

      {/* Modal para agregar productos */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productosDisponibles.map((producto, idx) => (
            <Form.Check
              key={idx}
              label={producto}
              checked={productosSeleccionados.includes(producto)}
              onChange={() => toggleProducto(producto)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CrearSubasta;
