import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Alert, Badge, ListGroup, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import keycloak from '../keycloak';

const MisSubastas = () => {
  const [misSubastas, setMisSubastas] = useState([]);
  const [pujasPorSubasta, setPujasPorSubasta] = useState({});
  const [idUsuarioReal, setIdUsuarioReal] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = keycloak.tokenParsed?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisSubastas = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });
        const id = userResponse.data.id;
        setIdUsuarioReal(id);

        const subastaResponse = await axios.get('http://localhost:5118/subastas/api/Subastas', {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });

        const filtradas = subastaResponse.data.filter(s => s.idUsuario === id);
        setMisSubastas(filtradas);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus subastas.");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchMisSubastas();
    }
  }, [email]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const nuevasPujas = {};
      for (const subasta of misSubastas) {
        if (subasta.estado === 'Active') {
          try {
            const res = await axios.get(`http://localhost:5118/pujas/api/Pujas/subasta/${subasta.idSubasta}`, {
              headers: { Authorization: `Bearer ${keycloak.token}` }
            });
            nuevasPujas[subasta.idSubasta] = res.data;
          } catch (error) {
            console.error(`Error obteniendo pujas para ${subasta.idSubasta}:`, error);
          }
        }
      }
      setPujasPorSubasta(nuevasPujas);
    }, 5000);

    return () => clearInterval(interval);
  }, [misSubastas]);

  const iniciarSubasta = async (idSubasta) => {
    try {
      const body = {
        nuevoEstado: 'Active',
        idUsuario: idUsuarioReal
      };

      await axios.put(`http://localhost:5118/subastas/api/Subastas/${idSubasta}/estado`, body, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });

      alert("Subasta iniciada.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al iniciar la subasta");
    }
  };

  const cancelarSubasta = async (idSubasta) => {
    try {
      const body = {
        nuevoEstado: 'Ended',
        idUsuario: idUsuarioReal
      };

      await axios.put(`http://localhost:5118/subastas/api/Subastas/${idSubasta}/estado`, body, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });

      alert("Subasta cancelada correctamente.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al cancelar la subasta");
    }
  };

  const subastasFiltradas = misSubastas.filter((s) => {
    const coincideTexto =
      s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'Todos' || s.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Subastas</h2>
        <Button variant="primary" onClick={() => navigate('/crear-subasta')}>
          Crear Subasta
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Buscar por nombre o descripción..."
        className="mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <Form.Select
        className="mb-4"
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
      >
        <option value="Todos">Todas las subastas</option>
        <option value="Pending">Pendientes</option>
        <option value="Active">Activas</option>
        <option value="Ended">Finalizadas</option>
        <option value="Canceled">Canceladas</option>
        <option value="Pagada">Pagadas</option>
      </Form.Select>

      {subastasFiltradas.length === 0 ? (
        <p>No hay subastas que coincidan con los filtros.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {subastasFiltradas.map((subasta) => (
            <Col key={subasta.idSubasta}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{subasta.nombre}</Card.Title>
                  <Card.Text>{subasta.descripcion}</Card.Text>
                  <p><strong>Estado:</strong> <Badge bg={subasta.estado === 'Active' ? 'success' : subasta.estado === 'Pending' ? 'warning' : 'secondary'}>{subasta.estado}</Badge></p>
                  <p><strong>Precio Base:</strong> ${subasta.precioBase}</p>
                  <p><strong>Inicio:</strong> {new Date(subasta.fechaInicio).toLocaleString()}</p>

                  {subasta.estado === 'Pending' && (
                    <>
                      <Button variant="success" className="me-2" onClick={() => iniciarSubasta(subasta.idSubasta)}>Iniciar</Button>
                      <Button variant="warning" className="me-2" onClick={() => navigate(`/editar-subasta/${subasta.idSubasta}`)}>Editar</Button>
                    </>
                  )}

                  {subasta.estado === 'Active' && (
                    <Button variant="danger" onClick={() => cancelarSubasta(subasta.idSubasta)}>Finalizar</Button>
                  )}

                  {subasta.estado === 'Active' && (
                    <div className="mt-3">
                      <h6>Pujas en vivo:</h6>
                      {pujasPorSubasta[subasta.idSubasta]?.length > 0 ? (
                        <ListGroup>
                          {pujasPorSubasta[subasta.idSubasta].map((p, index) => (
                            <ListGroup.Item key={index} className="py-1">
                              <strong>{p.nombreUsuario || 'Usuario'}:</strong> ${p.monto}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p className="text-muted">Aún no hay pujas.</p>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MisSubastas;
