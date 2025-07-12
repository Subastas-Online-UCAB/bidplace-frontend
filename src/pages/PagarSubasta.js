import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';

const PagarSubasta = () => {
  const { idSubasta } = useParams();
  const navigate = useNavigate();

  const [subasta, setSubasta] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  const email = keycloak.tokenParsed?.email;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const headers = { Authorization: `Bearer ${keycloak.token}` };

        // Obtener subasta
        const resSubasta = await axios.get(`http://localhost:5118/subastas/api/Subastas/${idSubasta}`, { headers });
        setSubasta(resSubasta.data);

        // Obtener métodos de pago
        const resPagos = await axios.get(`http://localhost:5118/pagos/api/MediosPago/por-email/${email}`, { headers });
        setMetodosPago(resPagos.data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [idSubasta, email]);

  const handlePagar = async () => {
    if (!metodoSeleccionado) {
      setError('Por favor, seleccione un método de pago.');
      return;
    }

    try {
      setError('');
      setMensaje('');
      const response = await axios.post(
        `http://localhost:5118/pagos/api/Pagos/realizar`,
        {
          idSubasta: idSubasta,
          metodoPagoId: metodoSeleccionado
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        }
      );

      setMensaje('Pago realizado con éxito. Recibirás una confirmación por correo.');
      setTimeout(() => navigate('/historial'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ocurrió un error al procesar el pago.');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Pagar Subasta Ganada</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      {subasta && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{subasta.nombre}</Card.Title>
            <Card.Text>
              <strong>Monto a pagar:</strong> ${subasta.precioFinal} <br />
              <strong>Fecha de cierre:</strong> {new Date(subasta.fechaCierre).toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Método de Pago</Form.Label>
        <Form.Select value={metodoSeleccionado} onChange={(e) => setMetodoSeleccionado(e.target.value)}>
          <option value="">Seleccione uno</option>
          {metodosPago.map((metodo) => (
            <option key={metodo.id} value={metodo.id}>
              {metodo.tipo} - {metodo.ultimoDigito || metodo.descripcion}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button variant="success" onClick={handlePagar}>Pagar Ahora</Button>
    </Container>
  );
};

export default PagarSubasta;
