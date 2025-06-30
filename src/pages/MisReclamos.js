import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const MisReclamos = () => {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const emailUsuario = keycloak.tokenParsed?.email;

  useEffect(() => {
  const fetchReclamos = async () => {
    try {
      const response = await axios.get("http://localhost:5118/reclamos/api/reclamos", {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });

      const todosLosReclamos = response.data;

      const reclamosDelUsuario = todosLosReclamos.filter(
        (r) => r.usuarioId === emailUsuario
      );

      setReclamos(reclamosDelUsuario);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los reclamos.');
    } finally {
      setLoading(false);
    }
  };

  fetchReclamos();
}, [emailUsuario]);


  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (reclamos.length === 0) return <Alert variant="info">No tienes reclamos registrados.</Alert>;

  return (
    <Container className="mt-5 pt-4">
      <h2>Mis Reclamos</h2>
      {reclamos.map((reclamo) => (
        <Card key={reclamo.id} className="mb-3">
          <Card.Body>
            <Card.Title>Reclamo #{reclamo.id}</Card.Title>
            <Card.Text><strong>Motivo:</strong> {reclamo.motivo}</Card.Text>
            <Card.Text><strong>Descripción:</strong> {reclamo.descripcion}</Card.Text>
            <Card.Text><strong>Estado:</strong> {reclamo.estado}</Card.Text>
            <Card.Text><strong>Subasta:</strong> {reclamo.subastaId}</Card.Text>
            <Card.Text><strong>Fecha:</strong> {new Date(reclamo.fechaCreacion).toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default MisReclamos;
