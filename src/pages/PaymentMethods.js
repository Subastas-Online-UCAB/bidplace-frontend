import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const PaymentMethods = () => {
  const [metodos, setMetodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoMetodo, setNuevoMetodo] = useState({ tipo: '', detalles: '' });

  const fetchMetodos = async () => {
    const res = await axios.get('http://localhost:5118/pagos/api/metodos', {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });
    setMetodos(res.data);
  };

  const agregarMetodo = async () => {
    await axios.post('http://localhost:5118/pagos/api/metodos', nuevoMetodo, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });
    setNuevoMetodo({ tipo: '', detalles: '' });
    setShowModal(false);
    fetchMetodos();
  };

  const eliminarMetodo = async (id) => {
    if (!window.confirm('¿Eliminar este método de pago?')) return;
    await axios.delete(`http://localhost:5118/pagos/api/metodos/${id}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });
    fetchMetodos();
  };

  const establecerPredeterminado = async (id) => {
    await axios.put(`http://localhost:5118/pagos/api/metodos/${id}/predeterminado`, null, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });
    fetchMetodos();
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Métodos de Pago</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>Agregar nuevo</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Detalles</th>
            <th>Último uso</th>
            <th>Predeterminado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {metodos.map((m) => (
            <tr key={m.id}>
              <td>{m.tipo}</td>
              <td>{m.detallesPublicos}</td>
              <td>{m.fechaUltimoUso || 'N/A'}</td>
              <td>{m.esPredeterminado ? '✅' : ''}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => eliminarMetodo(m.id)}>Eliminar</Button>{' '}
                {!m.esPredeterminado && (
                  <Button variant="secondary" size="sm" onClick={() => establecerPredeterminado(m.id)}>
                    Predeterminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Método de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tarjeta, Cuenta, Billetera..."
                value={nuevoMetodo.tipo}
                onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, tipo: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Detalles</Form.Label>
              <Form.Control
                type="text"
                placeholder="**** 1234 / Cuenta 0001"
                value={nuevoMetodo.detalles}
                onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, detalles: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={agregarMetodo}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentMethods;
