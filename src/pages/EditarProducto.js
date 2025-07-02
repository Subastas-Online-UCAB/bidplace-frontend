import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import keycloak from '../keycloak';

const EditarProducto = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    tipo: '',
    precioEstimado: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Obtener datos del producto al cargar
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:5118/productos/api/Productos/buscar/${id}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        setFormData(response.data);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError('No se pudo cargar el producto.');
      }
    };

    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5118/productos/api/Productos/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate('/productos'), 1500);
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      setError('Error al actualizar el producto.');
    }
  };

  return (
    <Container className="pt-5 mt-5 mb-5">
      <h2>Editar Producto</h2>

      {success && <Alert variant="success">Producto actualizado correctamente.</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
            min={1}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            type="text"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditarProducto;
