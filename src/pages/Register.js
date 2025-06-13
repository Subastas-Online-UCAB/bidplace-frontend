import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    firstName: '',   // Nombre del usuario
    lastName: '',    // Apellido del usuario
    cedula: '',      // Cédula del usuario
    phone: '',       // Teléfono del usuario
    birthDate: '',   // Fecha de nacimiento del usuario
    email: '',       // Correo electrónico del usuario
    password: '',    // Contraseña del usuario
    userType: 'postor' // Tipo de usuario, por defecto 'postor'
  });

  // Función para manejar el cambio de valores en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;  // Obtenemos el nombre y valor del campo modificado
    setFormData(prevData => ({
      ...prevData, // Mantenemos los datos previos
      [name]: value // Actualizamos solo el campo modificado
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();  // Evitamos que la página se recargue al enviar el formulario

    // Objeto con los datos que vamos a enviar al backend
    const userData = {
      nombre: formData.firstName,  // Nombre del usuario
      apellido: formData.lastName, // Apellido del usuario
      cedula: formData.cedula,     // Cédula del usuario
      telefono: formData.phone,    // Teléfono del usuario
      fechaNacimiento: formData.birthDate, // Fecha de nacimiento
      correo: formData.email,      // Correo electrónico
      clave: formData.password,    // Contraseña
      tipoUsuario: formData.userType // Tipo de usuario (postor o subastador)
    };

    try {
      // Conexión con el backend (API que maneja el registro de usuarios)
      const response = await fetch('http://localhost:5116/api/User/Register', {
        method: 'POST',  // Método HTTP utilizado para enviar datos
        headers: {
          'Content-Type': 'application/json'  // Indicamos que estamos enviando JSON
        },
        body: JSON.stringify(userData)  // Convertimos el objeto a JSON para enviarlo
      });

      // Si la respuesta es exitosa, mostramos un mensaje de éxito
      if (response.ok) {
        alert('¡Registro exitoso!');
        // Opcional: Redirigir al login o limpiar el formulario
        // Por ejemplo, puedes redirigir al login con: window.location.href = '/login';
      } else {
        // Si la respuesta no es exitosa, mostramos un mensaje de error
        const errorData = await response.json();
        alert(`Error al registrarse: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      // Si ocurre un error durante la conexión al backend
      console.error('Error en la petición:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="p-4 shadow register-card">
            <Card.Body>
              <h2 className="text-center mb-4">Crear Cuenta</h2>
              <Form onSubmit={handleSubmit}>
                {/* Sección de Nombre y Cédula */}
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formFirstName" className="mb-3">
                      <Form.Label className="label">Nombre</Form.Label>
                      <Form.Control 
                        type="text"
                        placeholder="Ingresa tu nombre"
                        name="firstName" // Nombre del campo para acceder en el estado
                        value={formData.firstName} // Valor actual del campo
                        onChange={handleChange} // Manejador de cambio
                        className="input-field"
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formCedula" className="mb-3">
                      <Form.Label className="label">Cédula</Form.Label>
                      <Form.Control 
                        type="text"
                        placeholder="Ingresa tu cédula"
                        name="cedula" // Nombre del campo para acceder en el estado
                        value={formData.cedula} // Valor actual del campo
                        onChange={handleChange} // Manejador de cambio
                        className="input-field"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="formLastName" className="mb-3">
                      <Form.Label className="label">Apellido</Form.Label>
                      <Form.Control 
                        type="text"
                        placeholder="Ingresa tu apellido"
                        name="lastName" // Nombre del campo para acceder en el estado
                        value={formData.lastName} // Valor actual del campo
                        onChange={handleChange} // Manejador de cambio
                        className="input-field"
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formPhone" className="mb-3">
                      <Form.Label className="label">Teléfono</Form.Label>
                      <Form.Control 
                        type="text"
                        placeholder="Ingresa tu número de teléfono"
                        name="phone" // Nombre del campo para acceder en el estado
                        value={formData.phone} // Valor actual del campo
                        onChange={handleChange} // Manejador de cambio
                        className="input-field"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Fecha de nacimiento */}
                <Form.Group controlId="formBirthDate" className="mb-3">
                  <Form.Label className="label">Fecha de nacimiento</Form.Label>
                  <Form.Control 
                    type="date"
                    name="birthDate" // Nombre del campo para acceder en el estado
                    value={formData.birthDate} // Valor actual del campo
                    onChange={handleChange} // Manejador de cambio
                    className="input-field"
                    required
                  />
                </Form.Group>

                {/* Correo electrónico */}
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="label">Correo electrónico</Form.Label>
                  <Form.Control 
                    type="email"
                    placeholder="Ingresa tu correo"
                    name="email" // Nombre del campo para acceder en el estado
                    value={formData.email} // Valor actual del campo
                    onChange={handleChange} // Manejador de cambio
                    className="input-field"
                    required
                  />
                </Form.Group>

                {/* Contraseña */}
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label className="label">Contraseña</Form.Label>
                  <Form.Control 
                    type="password"
                    placeholder="Crea una contraseña"
                    name="password" // Nombre del campo para acceder en el estado
                    value={formData.password} // Valor actual del campo
                    onChange={handleChange} // Manejador de cambio
                    className="input-field"
                    required
                  />
                </Form.Group>

                {/* Tipo de usuario */}
                <Form.Group controlId="formUserType" className="mb-4">
                  <Form.Label className="label">Tipo de usuario</Form.Label>
                  <Form.Control 
                    as="select"
                    name="userType" // Nombre del campo para acceder en el estado
                    value={formData.userType} // Valor actual del campo
                    onChange={handleChange} // Manejador de cambio
                    className="input-field"
                    required
                  >
                    <option value="postor">Postor</option>
                    <option value="subastador">Subastador</option>
                  </Form.Control>
                </Form.Group>

                {/* Botón de registro */}
                <Button variant="primary" type="submit" className="w-100 mb-3 button">
                  Registrarse
                </Button>

                <div className="text-center">
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
