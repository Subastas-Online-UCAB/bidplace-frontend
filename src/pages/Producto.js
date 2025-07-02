import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import keycloak from '../keycloak';

const Producto = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const email = keycloak.tokenParsed?.email;
        if (!email) {
          console.error('Email no encontrado en el token');
          return;
        }

        const userResponse = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });

        const userId = userResponse.data.id;

        const productosResponse = await axios.get('http://localhost:5118/productos/api/Productos', {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });

        const productosFiltrados = productosResponse.data.filter(p => p.idUsuario === userId);
        setProducts(productosFiltrados);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5118/productos/api/Productos/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });

      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <Container className="pt-5 mt-5 mb-5">
      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col xs="auto">
          <Button variant="success" onClick={() => navigate('/crear-producto')}>
            Crear Producto
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>{new Date(product.fechaCreacion || product.fecha || Date.now()).toLocaleDateString()}</td>
              <td>
                <Button
                  as={Link}
                  to={`/productos/${product.id}`}
                  variant="info"
                  className="btn-sm me-2"
                >
                  Ver
                </Button>
                <Button
                  as={Link}
                  to={`/productos/editar/${product.idProducto}`}
                  variant="warning"
                  className="btn-sm me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Producto;
