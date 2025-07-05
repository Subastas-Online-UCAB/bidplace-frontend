import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import { Table, Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Importación correcta

const HistorialPujas = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const cargarHistorial = async () => {
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

        const resultadosUsuario = [];

        for (const subasta of subastas) {
          const pujasResp = await axios.get(`http://localhost:5118/pujas/api/Pujas/subasta/${subasta.idSubasta}`, { headers });
          const pujas = pujasResp.data;

          const pujasUsuario = pujas.filter(p => p.idUsuario === email);

          if (pujasUsuario.length > 0) {
            const pujasOrdenadas = [...pujas].sort((a, b) => new Date(b.fechaPuja) - new Date(a.fechaPuja));
            const ultimaPuja = pujasOrdenadas[0];
            const ultimaPujaUsuario = [...pujasUsuario].sort((a, b) => new Date(b.fechaPuja) - new Date(a.fechaPuja))[0];
            const esGanador = subasta.estado === 'Ended' && ultimaPuja.idUsuario === email;

            resultadosUsuario.push({
              titulo: subasta.nombre,
              estado: subasta.estado,
              montoMaximoUsuario: Math.max(...pujasUsuario.map(p => p.monto)),
              fechaUltimaPuja: new Date(ultimaPujaUsuario.fechaPuja).toLocaleString(),
              gano: subasta.estado === 'Active' ? 'En curso' : esGanador ? 'Sí' : 'No',
              idSubasta: subasta.idSubasta
            });
          }
        }

        setResultados(resultadosUsuario);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando historial de pujas:', error);
        setLoading(false);
      }
    };

    cargarHistorial();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Historial de Pujas y Subastas Ganadas', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Título', 'Estado', 'Monto Máximo', 'Última Puja', '¿Ganaste?']],
      body: resultados.map(r => [r.titulo, r.estado, `$${r.montoMaximoUsuario}`, r.fechaUltimaPuja, r.gano])
    });
    doc.save('historial_pujas.pdf');
  };

  const resultadosFiltrados = resultados.filter(r => {
    return (
      (!searchTerm || r.titulo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!estadoFiltro || r.estado === estadoFiltro) &&
      (!fechaFiltro || r.fechaUltimaPuja.startsWith(fechaFiltro))
    );
  });

  return (
    <Container className="mt-4">
      <h2>Historial de Pujas y Subastas Ganadas</h2>

      <Row className="my-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Buscar por título"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Active">Activa</option>
            <option value="Ended">Finalizada</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button variant="success" onClick={exportarPDF}>Descargar PDF</Button>
        </Col>
      </Row>

      {loading ? (
        <p>Cargando...</p>
      ) : resultadosFiltrados.length === 0 ? (
        <p>No has participado en ninguna subasta con los filtros actuales.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Monto Máximo Ofertado</th>
              <th>Fecha Última Puja</th>
              <th>¿Ganaste?</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.map((r, index) => (
              <tr key={index}>
                <td>{r.titulo}</td>
                <td>{r.estado}</td>
                <td>${r.montoMaximoUsuario}</td>
                <td>{r.fechaUltimaPuja}</td>
                <td>{r.gano}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/properties/${r.idSubasta}`)}>
                    Ver detalles
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

export default HistorialPujas;
