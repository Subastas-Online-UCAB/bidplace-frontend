import React, { useEffect, useState, useRef } from 'react';
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
  imagen: null, // <-- para imagen nueva
  imagenActualUrl: '', // <-- para imagen del backend
});


  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
const [imagePreview, setImagePreview] = useState(null);
const fileInputRef = useRef(null);


  // Obtener datos del producto al cargar
  useEffect(() => {
    const fetchProducto = async () => {
  try {
    const response = await axios.get(`http://localhost:5118/productos/api/ProductosControlador/buscar/${id}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });

    const producto = response.data;

    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      tipo: producto.tipo,
      cantidad: producto.cantidad,
    });

    // Mostrar imagen si existe
    if (producto.imagenRuta) {
  const imagenUrl = `http://localhost:5101/${producto.imagenRuta}`;
  setImagePreview(imagenUrl);
  setFormData(prev => ({
    ...prev,
    imagenActualUrl: imagenUrl,
  }));
}

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

async function urlToFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  const contentType = blob.type || 'image/jpeg';
  return new File([blob], filename, { type: contentType });
}


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const email = keycloak.tokenParsed.email;
    const responseUsuario = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    });

    const usuarioId = responseUsuario.data.id;

    const formToSend = new FormData();
    formToSend.append('ProductoId', id);
    formToSend.append('Nombre', formData.nombre);
    formToSend.append('Descripcion', formData.descripcion);
    formToSend.append('Tipo', formData.tipo);
    formToSend.append('Cantidad', formData.cantidad);
    formToSend.append('UsuarioId', usuarioId);

    // ✅ Imagen nueva o imagen existente convertida a File
    if (formData.imagen instanceof File) {
      formToSend.append('Imagen', formData.imagen);
    } else {
      const file = await urlToFile(formData.imagenActualUrl, 'imagen-original.jpg');
      formToSend.append('Imagen', file);
    }

    await axios.put(
      `http://localhost:5118/productos/api/ProductosControlador/editar?id=${id}`,
      formToSend,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    setSuccess(true);
    setTimeout(() => navigate('/productos'), 1500);
  } catch (err) {
    console.error('Error al actualizar el producto:', err.response || err);
    setError('Error al actualizar el producto.');
  }
};





  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({
      ...prev,
      imagen: file, // imagen nueva
    }));
    setImagePreview(URL.createObjectURL(file));
  }
};


const handleRemoveImage = () => {
  fileInputRef.current.value = '';
  setImagePreview(null);
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

        <Form.Group className="mb-3">
  <Form.Label>Imagen del producto</Form.Label>
  <div className="mb-2">
    {imagePreview ? (
      <img
        src={imagePreview}
        alt="Preview"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
      />
    ) : (
      <p className="text-muted">No hay imagen cargada.</p>
    )}
  </div>
  <Form.Control
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    ref={fileInputRef}
  />
  {imagePreview && (
    <Button variant="danger" size="sm" className="mt-2" onClick={handleRemoveImage}>
      Eliminar imagen
    </Button>
  )}
</Form.Group>

        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditarProducto;
