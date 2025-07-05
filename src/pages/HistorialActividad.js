import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import keycloak from '../keycloak';

const HistorialActividad = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [accionesUnicas, setAccionesUnicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtros, setFiltros] = useState({
    accion: '',
    desde: '',
    hasta: ''
  });

  useEffect(() => {
    const fetchHistorial = async () => {
      const email = keycloak.tokenParsed?.email;
      if (!email) {
        setError('No se pudo obtener el email del usuario.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5118/usuarios/api/User/historial/${email}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
        setMovimientos(response.data);
        setFiltrados(response.data);

        const acciones = [...new Set(response.data.map(m => m.accion))];
        setAccionesUnicas(acciones);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('No se pudo cargar el historial.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const aplicarFiltros = () => {
    let resultado = [...movimientos];

    if (filtros.accion) {
      resultado = resultado.filter(m => m.accion === filtros.accion);
    }

    if (filtros.desde) {
      const desde = new Date(filtros.desde);
      resultado = resultado.filter(m => new Date(m.fechaHora) >= desde);
    }

    if (filtros.hasta) {
      const hasta = new Date(filtros.hasta);
      resultado = resultado.filter(m => new Date(m.fechaHora) <= hasta);
    }

    setFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setFiltros({ accion: '', desde: '', hasta: '' });
    setFiltrados(movimientos);
  };

  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4 text-center">Historial de Actividad</h2>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && movimientos.length > 0 && (
        <>
          {/* Filtros */}
          <Form className="mb-4">
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filtrar por acción</Form.Label>
                  <Form.Select
                    value={filtros.accion}
                    onChange={(e) => setFiltros({ ...filtros, accion: e.target.value })}
                  >
                    <option value="">Todas</option>
                    {accionesUnicas.map((accion, idx) => (
                      <option key={idx} value={accion}>{accion}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.desde}
                    onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.hasta}
                    onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Button variant="primary" onClick={aplicarFiltros} className="w-100 mb-2">
                  Aplicar
                </Button>
                <Button variant="secondary" onClick={limpiarFiltros} className="w-100">
                  Limpiar
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Tabla */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Acción</th>
                <th>Detalles</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((mov, index) => (
                <tr key={index}>
                  <td>{mov.accion}</td>
                  <td>{mov.detalles}</td>
                  <td>{mov.fechaHora ? new Date(mov.fechaHora).toLocaleString('es-VE') : 'Sin fecha'}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filtrados.length === 0 && (
            <Alert variant="info" className="mt-3">
              No hay movimientos que coincidan con los filtros seleccionados.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default HistorialActividad;
