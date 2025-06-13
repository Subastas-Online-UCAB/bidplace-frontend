import React, { useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// Lista de productos de ejemplo (esto eventualmente se reemplazaría por datos provenientes del backend)
const initialProducts = [
  { id: 1, name: 'Producto A', date: '2025-04-20' },
  { id: 2, name: 'Producto B', date: '2025-04-22' },
  { id: 3, name: 'Producto C', date: '2025-04-25' },
];

const Producto = () => {
  const [products, setProducts] = useState(initialProducts); // Estado que guarda los productos
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para eliminar el producto
  const handleDelete = (id) => {
    // 🔴 Aquí deberías hacer una petición al backend para eliminar el producto
    // Ejemplo: await axios.delete(`/api/productos/${id}`);
    
    // Luego actualizas el estado local para reflejar el cambio
    setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
  };

  return (
    <Container className="my-5">
      {/* Encabezado con botón para crear un nuevo producto */}
      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col xs="auto">
          {/* Al presionar el botón, redirige a la página de creación de producto */}
          <Button variant="success" onClick={() => navigate('/crear-producto')}>
            Crear Producto
          </Button>
        </Col>
      </Row>

      {/* Tabla que lista los productos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Recorremos los productos y mostramos cada uno en una fila */}
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{new Date(product.date).toLocaleDateString()}</td> {/* Formateamos la fecha */}
              <td>
                {/* Botón para ver detalles del producto */}
                <Button as={Link} to={`/productos/${product.id}`} variant="info" className="btn-sm me-2">
                  Ver
                </Button>

                {/* Botón para editar producto */}
                <Button variant="warning" className="btn-sm me-2">
                  Editar
                </Button>

                {/* Botón para eliminar producto */}
                <Button 
                  variant="danger" 
                  className="btn-sm"
                  onClick={() => handleDelete(product.id)} // Ejecuta la función de eliminar
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
