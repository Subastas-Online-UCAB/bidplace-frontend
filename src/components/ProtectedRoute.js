import React from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  const hasAccess = allowedRoles.some(role => roles.includes(role));

  return hasAccess ? children : <Navigate to="/properties" replace />;
};

export default ProtectedRoute;
