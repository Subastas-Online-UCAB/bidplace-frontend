import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import keycloak from '../keycloak';

function CrearProducto() {
  const [imagePreview, setImagePreview] = useState(null);
  const [idUsuario, setIdUsuario] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    cantidad: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const obtenerIdUsuario = async () => {
      try {
        const email = keycloak.tokenParsed?.email;
        if (!email) {
          console.error('Email no encontrado en el token');
          return;
        }

        const response = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });

        setIdUsuario(response.data.id);
      } catch (error) {
        console.error('Error obteniendo el id del usuario:', error);
      }
    };

    obtenerIdUsuario();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = '';
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('Nombre', formData.nombre);
  form.append('Descripcion', formData.descripcion);
  form.append('Tipo', formData.tipo);
  form.append('Cantidad', parseInt(formData.cantidad));
  form.append('IdUsuario', idUsuario);

  if (fileInputRef.current.files[0]) {
    form.append('Imagen', fileInputRef.current.files[0]);
  }

  try {
    const response = await axios.post(
      'http://localhost:5118/productos/api/ProductosControlador',
      form,
      {
        headers: {
      Authorization: `Bearer ${keycloak.token}`, // ✅ NO pongas Content-Type manualmente
    },
      }
    );

    alert('Producto creado correctamente');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    alert('Error al crear el producto');
  }
};


  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Crear Producto</h2>
      <div className="row">
        <div className="col-md-6 d-flex flex-column align-items-center">
          <div
            className="border rounded p-4 w-100 d-flex flex-column align-items-center justify-content-center"
            style={{ height: '400px', cursor: 'pointer', backgroundColor: '#f8f9fa' }}
            onClick={handleBoxClick}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <p className="text-muted">Haz clic aquí para cargar una imagen</p>
            )}
          </div>

          {imagePreview && (
            <button className="btn btn-danger mt-3" onClick={handleRemoveImage}>
              Eliminar Imagen
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">Tipo (Categoría)</label>
              <select
                className="form-select"
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una categoría</option>
                <option>Arte y antigüedades</option>
                <option>Ropa y accesorios</option>
                <option>Electrónica</option>
                <option>Vehículos</option>
                <option>Inmuebles</option>
                <option>Joyería y accesorios</option>
                <option>Música e instrumentos</option>
                <option>Libros y coleccionables</option>
                <option>Hogar y jardín</option>
                <option>Juguetes y juegos</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                rows="5"
                value={formData.descripcion}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="cantidad" className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-control"
                id="cantidad"
                name="cantidad"
                min="1"
                value={formData.cantidad}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearProducto;
