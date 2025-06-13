import keycloak from './keycloak';

let initialized = false;

export const initKeycloak = () => {
  if (!initialized) {
    initialized = true;
    return keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    });
  } else {
    return Promise.resolve(keycloak.authenticated);
  }
};

export default keycloak;
