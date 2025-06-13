import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import properties from '../data/properties';

const categories = [
  'Arte y antiguedades', 'Ropa y accesorios', 'Electronica', 'Vehiculos',
  'Inmuebles', 'Joyeria y accesorios', 'Musica e instrumentos', 'Libros y coleccionables',
  'Hogar y jardin', 'Juguetes y juegos'
];

const statuses = ['Todas', 'Activa', 'Finalizada', 'Pendiente'];

const SubastasVistaGeneral = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todas');

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const filteredProperties = properties.filter((property) => {
    const categoryMatch = selectedCategory === 'Todas' || property.category === selectedCategory;
    const searchMatch = property.title.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = selectedStatus === 'Todas' || property.status === selectedStatus;
    return categoryMatch && searchMatch && statusMatch;
  });

  return (
    <Container className="my-5">
      {/* Filtros superiores: Categoría + Buscar */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Categoría</Form.Label>
          <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="Todas">Todas</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={9}>
          <Form.Label>Buscar</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Fila inferior: Botón Crear Subasta a la izquierda y Estatus a la derecha */}
      <Row className="mb-4">
        {/* Botón Crear Subasta a la izquierda */}
        <Col md={3} className="d-flex align-items-end">
          <Button variant="primary" onClick={() => navigate('/crear-subasta')}>
            Crear Subasta
          </Button>
        </Col>

        {/* Estatus a la derecha */}
        <Col md={{ span: 3, offset: 6 }}>
          <Form.Label>Estatus</Form.Label>
          <Form.Select value={selectedStatus} onChange={handleStatusChange}>
            {statuses.map((status, idx) => (
              <option key={idx} value={status}>{status}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Tabla de Subastas */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre de la Subasta</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{new Date(property.startDate).toLocaleDateString()}</td>
              <td>{new Date(property.endDate).toLocaleDateString()}</td>
              <td>
                <Button as={Link} to={`/properties/${property.id}`} variant="info" size="sm" className="me-2">
                  <i className="bi bi-eye" /> Ver
                </Button>
                <Button variant="warning" size="sm" className="me-2">
                  <i className="bi bi-pencil" /> Editar
                </Button>
                <Button variant="danger" size="sm">
                  <i className="bi bi-trash" /> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SubastasVistaGeneral;