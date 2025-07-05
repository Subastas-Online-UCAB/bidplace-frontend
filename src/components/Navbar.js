import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Image
} from 'react-bootstrap';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Navbar.css';

import lawLogo from '../pages/img/law.png';
import defaultUserImage from '../pages/img/usuario.png';
import keycloak from "../keycloak";

const NavigationBar = () => {
  const [user, setUser] = useState({
    name: "Usuario Demo",
    profileImage: defaultUserImage,
  });

  const isPostor = keycloak?.tokenParsed?.realm_access?.roles?.includes("Postor");
  const isSubastador = keycloak?.tokenParsed?.realm_access?.roles?.includes("subastador");
  const isAdmin = keycloak?.tokenParsed?.realm_access?.roles?.includes("Administrador");

  useEffect(() => {
    if (keycloak && keycloak.tokenParsed) {
      const username = keycloak.tokenParsed.preferred_username || "Usuario Demo";
      const profileImg = keycloak.tokenParsed.picture || defaultUserImage;

      setUser({
        name: username,
        profileImage: profileImg,
      });
    }
  }, []);

  const navigate = useNavigate();

  const secciones = {
    "/home": "Inicio",
    "/properties": "Consultar Subastas",
    "/historial": "Historial de actividad",
    "/soporte": "Soporte",
    "/cuenta": "Configuración de la cuenta",
    "/pagos": "Gestionar métodos de pago",
    "/mis-reclamos": "Mis Reclamos",
    "/producto": "Gestionar productos",
    "/mis-subastas": "Mis Subastas",
    "/admin": "Gestión de roles y permisos",
    "/admin/reclamos": "Reclamos (Administrador)"
  };

  const handleNavClick = async (e, to) => {
    e.preventDefault();

    const email = keycloak.tokenParsed?.email;
    const nombreSeccion = secciones[to] || to;

    try {
      if (email) {
        await axios.post('http://localhost:5118/usuarios/api/User/registrar-movimiento', {
          email: email,
          accion: nombreSeccion,
          detalles: `El usuario accedió a la sección: ${nombreSeccion}`
        }, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error registrando movimiento:', error);
    } finally {
      navigate(to);
    }
  };

  return (
    <Navbar expand="lg" className="bg-white shadow-sm py-3 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={(e) => handleNavClick(e, "/home")} className="d-flex align-items-center">
          <img src={lawLogo} alt="Logo" width={28} height={28} className="me-2" />
          <span className="fs-5 fw-bold text-dark">
            BidPlace<span className="text-danger">.</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link as={Link} to="/home" onClick={(e) => handleNavClick(e, "/home")} className="text-dark fw-medium mx-2 border-bottom border-danger pb-1">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/subastas" onClick={(e) => handleNavClick(e, "/properties")} className="text-dark fw-medium mx-2">
              Consultar Subastas
            </Nav.Link>
            <Nav.Link as={Link} to="/historial" onClick={(e) => handleNavClick(e, "/historial")} className="text-dark fw-medium mx-2">
              Historial de actividad
            </Nav.Link>
            <Nav.Link as={Link} to="/soporte" onClick={(e) => handleNavClick(e, "/soporte")} className="text-dark fw-medium mx-2">
              Soporte
            </Nav.Link>
            <Nav.Link as={Link} to="/historial-pujas">Historial de Pujas</Nav.Link>

          </Nav>

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
                  {user?.name}
                </Dropdown.Header>

                {(isPostor || isSubastador || isAdmin) && (
                  <Dropdown.Item onClick={(e) => handleNavClick(e, "/cuenta")}>Configuración de la cuenta</Dropdown.Item>
                )}

                {isPostor && (
                  <>
                    <Dropdown.Item onClick={(e) => handleNavClick(e, "/pagos")}>Gestionar métodos de pago</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleNavClick(e, "/mis-reclamos")}>Mis Reclamos</Dropdown.Item>
                  </>
                )}

                {isSubastador && (
                  <>
                    <Dropdown.Item onClick={(e) => handleNavClick(e, "/producto")}>Gestionar productos</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleNavClick(e, "/mis-subastas")}>Mis Subastas</Dropdown.Item>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Dropdown.Item onClick={(e) => handleNavClick(e, "/admin")}>Gestionar roles y permisos</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleNavClick(e, "/admin/reclamos")}>Mis Reclamos</Dropdown.Item>
                  </>
                )}

                <Dropdown.Divider />

                <Dropdown.Item onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("roles");
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
