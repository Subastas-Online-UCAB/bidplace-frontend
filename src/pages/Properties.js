import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import keycloak from '../keycloak';
import './Properties.css';

const categories = [
  'Arte y antigüedades', 'Ropa y accesorios', 'Electrónica', 'Vehículos',
  'Inmuebles', 'Joyería y accesorios', 'Música e instrumentos', 'Libros y coleccionables',
  'Hogar y jardín', 'Juguetes y juegos'
];

const statuses = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Pendiente', value: 'Pending' },
  { label: 'Activa', value: 'Active' },
  { label: 'Finalizada', value: 'Ended' },
  { label: 'Completada', value: 'Completed' },
  { label: 'Cancelada', value: 'Canceled' }
];

const statusColors = {
  Activa: 'Active',
  Finalizada: 'Completed',
  Pendiente: 'Pending',
  Canceladas: 'Canceled'
};

const SubastasVistaGeneral = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todas');
  const [subastas, setSubastas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [esSubastador, setEsSubastador] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = keycloak.tokenParsed?.realm_access?.roles || [];
        setEsSubastador(roles.includes('subastador'));

        const [subastasResponse, productosResponse] = await Promise.all([
          axios.get('http://localhost:5118/subastas/api/Subastas', {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }),
          axios.get('http://localhost:5118/productos/api/ProductosControlador', {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          })
        ]);

        setSubastas(subastasResponse.data);
        setProductos(productosResponse.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las subastas o productos.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount || 0);
  };

  const truncateDescription = (desc) => {
    if (!desc) return 'Descripción no disponible';
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  const mappedSubastas = subastas.map(subasta => {
    const producto = productos.find(p => p.idProducto === subasta.idProducto);

    return {
      id: subasta.idSubasta,
      title: subasta.nombre,
      description: subasta.descripcion,
      category: subasta.tipoSubasta,
      status: subasta.estado,
      currentBid: subasta.precioBase,
      endDate: subasta.fechaInicio,
      image: producto?.imagenRuta
        ? `http://localhost:5101${producto.imagenRuta}`
        : 'https://via.placeholder.com/300x200?text=Subasta'
    };
  });

  const filteredProperties = mappedSubastas.filter((property) => {
    if (!property) return false;
    const categoryMatch = selectedCategory === 'Todas' || property.category === selectedCategory;
    const searchMatch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (property.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const statusMatch = selectedStatus === 'Todas' || property.status === selectedStatus;
    return categoryMatch && searchMatch && statusMatch;
  });

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando subastas...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h2 className="page-title"> Subastas Disponibles</h2>
          <p className="text-muted">Explora las mejores oportunidades en subastas exclusivas</p>
        </Col>
        <Col md={4} className="text-end">
          {esSubastador && (
            <Button 
              variant="primary" 
              onClick={() => navigate('/crear-subasta')}
              className="create-auction-btn"
            >
              <i className="bi bi-plus-lg me-2"></i>Crear Subasta
            </Button>
          )}
        </Col>
      </Row>

      <Card className="mb-4 filter-card">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Select 
                  value={selectedCategory} 
                  onChange={handleCategoryChange}
                  className="filter-select"
                >
                  <option value="Todas">Todas las categorías</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select 
                  value={selectedStatus} 
                  onChange={handleStatusChange}
                  className="filter-select"
                >
                  {statuses.map((status, idx) => (
                    <option key={idx} value={status.value}>{status.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Buscar</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Buscar subastas..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  <Button variant="outline-secondary" className="search-btn">
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredProperties.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredProperties.map((property) => (
            property && (
              <Col key={property.id}>
                <Card className="auction-card h-100">
                  <div className="auction-image-container">
                    <Card.Img 
                      variant="top" 
                      src={property.image} 
                      className="auction-image"
                    />
                    <Badge 
                      bg={statusColors[property.status] || 'secondary'} 
                      className="status-badge"
                    >
                      {property.status || 'Sin estado'}
                    </Badge>
                    {(property.currentBid || property.currentBid === 0) && (
                      <Badge bg="dark" className="bid-badge">
                        Oferta: {formatCurrency(property.currentBid)}
                      </Badge>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="auction-title">{property.title || 'Título no disponible'}</Card.Title>
                    <Card.Text className="auction-description">
                      {truncateDescription(property.description)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <small className="text-muted">Categoría:</small>
                        <div className="fw-bold">{property.category || 'Sin categoría'}</div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">Finaliza:</small>
                        <div className="fw-bold">
                          {property.endDate ? new Date(property.endDate).toLocaleDateString() : 'Sin fecha'}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <div className="d-grid gap-2">
                      <Button 
                        as={Link} 
                        to={`/properties/${property.id}`} 
                        variant="outline-primary"
                        className="view-btn"
                      >
                        <i className="bi bi-eye me-2"></i>Ver detalles
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            )
          ))}
        </Row>
      ) : (
        <Card className="text-center py-5">
          <Card.Body>
            <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            <h5 className="mt-3">No se encontraron subastas</h5>
            <p className="text-muted">Intenta ajustar tus filtros de búsqueda</p>
            <Button 
              variant="outline-primary" 
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchTerm('');
                setSelectedStatus('Todas');
              }}
            >
              Limpiar filtros
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SubastasVistaGeneral;
