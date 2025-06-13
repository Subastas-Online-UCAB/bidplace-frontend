import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Image
} from 'react-bootstrap';

import { Link, useNavigate } from 'react-router-dom';

import './Navbar.css';

// Importa el logo del sitio y la imagen por defecto del usuario
import lawLogo from '../pages/img/law.png';
import defaultUserImage from '../pages/img/usuario.png';
import keycloak from "../keycloak"; // Ajusta la ruta si está en otro lugar

const NavigationBar = () => {
  // Estado para almacenar la información del usuario logueado
  const [user, setUser] = useState({
    name: "Usuario Demo",
    profileImage: defaultUserImage,
  });

  // Verificamos si el usuario tiene ciertos roles desde el token de Keycloak
  const isPostor = keycloak?.tokenParsed?.realm_access?.roles?.includes("postor");
  const isSubastador = keycloak?.tokenParsed?.realm_access?.roles?.includes("subastador");
  const isAdmin = keycloak?.tokenParsed?.realm_access?.roles?.includes("administrador");

  // Usamos useEffect para actualizar el nombre del usuario al cargar el componente
  useEffect(() => {
    if (keycloak && keycloak.tokenParsed) {
      // Obtener el nombre del usuario desde el token
      const username = keycloak.tokenParsed.preferred_username || "Usuario Demo";
      const profileImg = keycloak.tokenParsed.picture || defaultUserImage; // Puedes ajustar esto si tienes una imagen configurada

      // Actualizar el estado del usuario
      setUser({
        name: username,
        profileImage: profileImg,
      });
    }
  }, []); // Solo se ejecuta una vez al cargar el componente

  const navigate = useNavigate();

  // Función para manejar el click de navegación
  const handleNavClick = (e, to) => {
    if (to === "/home") return;
    navigate(to);
  };

  return (
    <Navbar expand="lg" className="bg-white shadow-sm py-3 fixed-top">
      <Container>
        {/* Logo y nombre del sitio */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={lawLogo} alt="Logo" width={28} height={28} className="me-2" />
          <span className="fs-5 fw-bold text-dark">
            BidPlace<span className="text-danger">.</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Menú de navegación principal */}
          <Nav className="me-auto ms-4">
            <Nav.Link as={Link} to="/home" className="text-dark fw-medium mx-2 border-bottom border-danger pb-1">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/properties" onClick={(e) => handleNavClick(e, "/subastas")} className="text-dark fw-medium mx-2">
              Consultar Subastas
            </Nav.Link>
            <Nav.Link as={Link} to="/historial" onClick={(e) => handleNavClick(e, "/historial")} className="text-dark fw-medium mx-2">
              Historial de actividad
            </Nav.Link>
            <Nav.Link as={Link} to="/soporte" onClick={(e) => handleNavClick(e, "/soporte")} className="text-dark fw-medium mx-2">
              Soporte
            </Nav.Link>
          </Nav>

          {/* Menú del usuario logueado */}
          <Nav className="align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="p-0 border-0">
                <Image
                  src={user?.profileImage || defaultUserImage}
                  roundedCircle
                  width={38}
                  height={38}
                  className="mx-2"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header className="fw-semibold text-dark">
                  {user?.name} {/* Aquí se muestra el nombre del usuario logueado */}
                </Dropdown.Header>
                
                {/* Configuración de la cuenta visible para postor, subastador y administrador */}
                {(isPostor || isSubastador || isAdmin) && (
                  <Dropdown.Item as={Link} to="/cuenta">Configuración de la cuenta</Dropdown.Item>
                )}

                {/* Métodos de pago solo visible para el rol postor */}
                {isPostor && (
                  <Dropdown.Item as={Link} to="/pagos">Gestionar métodos de pago</Dropdown.Item>
                )}

                {/* Gestionar productos solo visible para el rol subastador */}
                {isSubastador && (
                  <Dropdown.Item as={Link} to="/producto">Gestionar productos</Dropdown.Item>
                )}

                {/* Gestionar roles y permisos solo visible para el rol administrador */}
                {isAdmin && (
                  <Dropdown.Item as={Link} to="/admin">Gestionar roles y permisos</Dropdown.Item>
                )}

                <Dropdown.Divider />
                
                {/* Cerrar sesión */}
                <Dropdown.Item onClick={() => {
                      // Elimina datos del localStorage
                      localStorage.removeItem("token");
                      localStorage.removeItem("roles");

                      // Redirige con Keycloak logout y una URI de retorno
                      keycloak.logout({
                        redirectUri: window.location.origin
                      });
                  }}>
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
