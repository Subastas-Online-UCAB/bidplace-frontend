import React, { useState, useRef } from 'react';

function CrearProducto() {
  // Estado para previsualizar la imagen seleccionada
  const [imagePreview, setImagePreview] = useState(null);

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: ''
  });

  // Referencia para el input de archivo (imagen)
  const fileInputRef = useRef(null);

  // Maneja el cambio de imagen (cuando el usuario selecciona un archivo)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Crea una URL temporal para mostrar la imagen
    }
  };

  // Maneja la eliminación de la imagen seleccionada
  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = ''; // Limpia el input de tipo file
  };

  // Abre el selector de archivos al hacer clic en la caja
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  // Maneja el cambio en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Actualiza el valor del campo correspondiente
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔴 Aquí deberías realizar la conexión al backend para enviar los datos del producto
    // Ejemplo: 
    // const dataToSend = new FormData();
    // dataToSend.append('nombre', formData.nombre);
    // dataToSend.append('categoria', formData.categoria);
    // dataToSend.append('descripcion', formData.descripcion);
    // dataToSend.append('imagen', fileInputRef.current.files[0]);
    //
    // await axios.post('/api/productos', dataToSend);

    console.log('Formulario enviado:', formData); // Actualmente solo imprime en consola
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Crear Producto</h2>
      <div className="row">
        {/* Zona izquierda - Imagen */}
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
            <button
              className="btn btn-danger mt-3"
              onClick={handleRemoveImage}
            >
              Eliminar Imagen
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }} // Ocultamos el input de tipo file
          />
        </div>

        {/* Zona derecha - Formulario */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                placeholder="Ej: Reloj Smartwatch"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Categoría</label>
              <select
                className="form-select"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              >
                <option>Selecciona una categoría</option>
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
                placeholder="Descripción detallada del producto..."
                value={formData.descripcion}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearProducto;
