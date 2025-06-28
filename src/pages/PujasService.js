import axios from 'axios';
import keycloak from '../keycloak';

export const obtenerPujasPorSubasta = async (idSubasta) => {
  try {
    const response = await axios.get(`http://localhost:5118/pujas/api/Pujas/subasta/${idSubasta}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo pujas para la subasta ${idSubasta}:`, error);
    return [];
  }
};
