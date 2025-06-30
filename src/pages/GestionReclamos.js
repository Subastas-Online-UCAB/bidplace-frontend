import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import {
  Container, Card, Button, Spinner, Alert, Badge,
  Row, Col, Form
} from 'react-bootstrap';

const GestionReclamos = () => {
  const [reclamos, setReclamos] = useState([]);
  const [filteredReclamos, setFilteredReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  const fetchReclamos = async () => {
    try {
      const response = await axios.get("http://localhost:5118/reclamos/api/reclamos", {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      setReclamos(response.data);
      setFilteredReclamos(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los reclamos.');
    } finally {
      setLoading(false);
    }
  };

  const marcarComoResuelto = async (reclamoId) => {
    try {
      await axios.put(`http://localhost:5118/reclamos/api/reclamos/resolver/${reclamoId}`, {}, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });

      const actualizados = reclamos.map(r =>
        r.id === reclamoId ? { ...r, estado: "Resuelto" } : r
      );
      setReclamos(actualizados);
      aplicarFiltros(actualizados);
    } catch (err) {
      console.error("Error al marcar como resuelto:", err);
      alert("No se pudo marcar el reclamo como resuelto.");
    }
  };

  const aplicarFiltros = (lista = reclamos) => {
    const resultado = lista.filter(r => {
      const coincideBusqueda =
        r.usuarioId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.motivo.toLowerCase().includes(searchTerm.toLowerCase());

      const coincideEstado = estadoFilter === '' || r.estado === estadoFilter;

      return coincideBusqueda && coincideEstado;
    });

    setFilteredReclamos(resultado);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setEstadoFilter('');
    setFilteredReclamos(reclamos);
  };

  useEffect(() => {
    fetchReclamos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, estadoFilter]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5 pt-4">
      <h2 className="mb-4">Gestión de Reclamos</h2>

      <Row className="mb-3">
        <Col md={5}>
          <Form.Control
            placeholder="Buscar por usuario o motivo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Resuelto">Resuelto</option>
            <option value="En revisión">En revisión</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="secondary" onClick={limpiarFiltros}>Limpiar filtros</Button>
        </Col>
      </Row>

      {filteredReclamos.length === 0 ? (
        <Alert variant="info">No se encontraron reclamos con los filtros aplicados.</Alert>
      ) : (
        filteredReclamos.map((reclamo) => (
          <Card key={reclamo.id} className="mb-3">
            <Card.Body>
              <Card.Title>Reclamo #{reclamo.id}</Card.Title>
              <Card.Text><strong>Usuario:</strong> {reclamo.usuarioId}</Card.Text>
              <Card.Text><strong>Motivo:</strong> {reclamo.motivo}</Card.Text>
              <Card.Text><strong>Estado:</strong>
                <Badge bg={reclamo.estado === "Resuelto" ? "success" : "warning"} className="ms-2">
                  {reclamo.estado}
                </Badge>
              </Card.Text>
              <Card.Text><strong>Fecha:</strong> {new Date(reclamo.fechaCreacion).toLocaleString()}</Card.Text>

              <div className="d-flex gap-2">
                <Button
                  variant="info"
                  onClick={() => alert(`Descripción:\n${reclamo.descripcion}`)}
                >
                  Ver Detalles
                </Button>
                {reclamo.estado !== "Resuelto" && (
                  <Button
                    variant="success"
                    onClick={() => marcarComoResuelto(reclamo.id)}
                  >
                    Marcar como Resuelto
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default GestionReclamos;
