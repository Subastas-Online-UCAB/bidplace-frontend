import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081/",          // URL donde corre Keycloak
  realm: "microservicio-usuarios",            // nombre del realm
  clientId: "frontend-app",       // nombre del cliente 
});

export default keycloak;

