import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import { Table, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SubastasGanadas = () => {
  const [subastasGanadas, setSubastasGanadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarSubastasGanadas = async () => {
      try {
        const email = keycloak.tokenParsed?.email;
        const token = keycloak.token;

        if (!email || !token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const subastasResp = await axios.get('http://localhost:5118/subastas/api/Subastas', { headers });
        const subastas = subastasResp.data;

        const ganadas = [];

        for (const subasta of subastas) {
          if (subasta.estado !== 'Ended') continue;

          const pujasResp = await axios.get(`http://localhost:5118/pujas/api/Pujas/subasta/${subasta.idSubasta}`, { headers });
          const pujas = pujasResp.data;

          const pujasOrdenadas = pujas.sort((a, b) => new Date(b.fechaPuja) - new Date(a.fechaPuja));
          const ultimaPuja = pujasOrdenadas[0];

          if (ultimaPuja?.idUsuario === email) {
            ganadas.push({
              idSubasta: subasta.idSubasta,
              titulo: subasta.nombre,
              montoGanador: ultimaPuja.monto,
              fechaGanada: new Date(ultimaPuja.fechaPuja).toLocaleString()
            });
          }
        }

        setSubastasGanadas(ganadas);
      } catch (error) {
        console.error('Error al cargar subastas ganadas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarSubastasGanadas();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Subastas Ganadas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : subastasGanadas.length === 0 ? (
        <p>No has ganado ninguna subasta.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Monto Ganador</th>
              <th>Fecha Ganada</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {subastasGanadas.map((s, idx) => (
              <tr key={idx}>
                <td>{s.titulo}</td>
                <td>${s.montoGanador}</td>
                <td>{s.fechaGanada}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => navigate(`/pagar-subasta/${s.idSubasta}`)}
                  >
                    Pagar ahora
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SubastasGanadas;
