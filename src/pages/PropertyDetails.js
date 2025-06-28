import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import keycloak from '../keycloak';
import './PropertyDetails.css';
import subastaImg from './img/subastadetailprueba.jpg';
import subastaImg1 from './img/subastadetailprueba1.jpg';
import subastaImg2 from './img/subastadetailprueba2.jpg';
import subastaImg3 from './img/subastadetailprueba3.jpg';
import subastaImg4 from './img/subastadetailprueba4.jpg';
import subastaImg5 from './img/subastadetailprueba5.jpg';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(subastaImg);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formValues, setFormValues] = useState({
    maxBid: '',
    increment: '',
    bidAmount: ''
  });
  const [pujas, setPujas] = useState([]);

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const role = roles.includes('subastador') ? 'Subastador' : 'Postor';

  const isAuctionActive = property?.estado === 'Active';

  useEffect(() => {
    const fetchSubasta = async () => {
      try {
        const response = await axios.get(`http://localhost:5118/subastas/api/Subastas/buscar/${id}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
        setProperty(response.data);
      } catch (error) {
        setError('No se pudo cargar la subasta.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubasta();
  }, [id]);

  const fetchPujas = async () => {
    try {
      const response = await axios.get(`http://localhost:5118/pujas/api/Pujas/subasta/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      setPujas(response.data);
    } catch (error) {
      console.error('Error al obtener las pujas:', error);
    }
  };

  useEffect(() => {
    fetchPujas();
    const interval = setInterval(fetchPujas, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGearClick = () => setShowModal(true);
  const handleMoreInfoClick = () => setShowInfoModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShowInfoModal(false);
  };

  const fetchRealUserId = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      return response.data.id;
    } catch (error) {
      console.error('Error al obtener el id real del usuario:', error);
      return null;
    }
  };

  const handleBidSubmit = async () => {
    const { bidAmount } = formValues;
    const email = keycloak.tokenParsed?.email;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      alert('Por favor, ingresa un monto válido para pujar.');
      return;
    }

    const realUserId = await fetchRealUserId(email);

    if (!realUserId) {
      alert('No se pudo identificar al usuario.');
      return;
    }

    const bidData = {
      subastaId: id,
      usuarioId: realUserId,
      monto: Number(bidAmount)
    };

    try {
      const response = await axios.post('http://localhost:5118/pujas/api/Pujas/registrarPuja', bidData, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert('Puja registrada con éxito');
        setFormValues(prev => ({ ...prev, bidAmount: '' }));
        fetchPujas(); // Actualiza lista al instante
      } else {
        alert('Error al registrar la puja');
      }
    } catch (error) {
      console.error('Error al enviar la puja:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  };

  if (loading) return <p className="property-loading">Cargando subasta...</p>;
  if (error) return <p className="property-error">{error}</p>;
  if (!property) return <p className="property-not-found">Subasta no encontrada.</p>;

  const highestBid = pujas.length > 0 ? Math.max(...pujas.map(p => p.monto)) : property.precioBase;

  return (
    <div className="property-details-container">
      <h1 className="property-title">{property.nombre}</h1>

      <div className="property-details-content">
        <div className="property-details-left">
          <img src={mainImage} alt="Subasta Detalle" className="property-details-image" />
          <div className="thumbnail-container">
            {[subastaImg1, subastaImg2, subastaImg3, subastaImg4, subastaImg5].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Subasta mini ${idx + 1}`}
                className="thumbnail-image"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <button className="more-info-button" onClick={handleMoreInfoClick}>
            Más información
          </button>
        </div>

        <div className="property-details-right">
          <div className="current-bid-box">
            {role === 'Postor' && (
              <div className="gear-icon" onClick={handleGearClick} title="Configurar puja automática">
                ⚙️
              </div>
            )}
            <h2>Puja actual</h2>
            <div className="amount">${highestBid}</div>
            <div className="details-row"><span>Monto base:</span><span>${property.precioBase}</span></div>
            {role === 'Postor' && (
              <div className="details-row"><span>Precio de reserva:</span><span>${property.precioReserva}</span></div>
            )}
            <div className="details-row"><span>Incremento mínimo:</span><span>${property.incrementoMinimo}</span></div>
            <div className="details-row"><span>Fecha/Hora de inicio:</span><span>{new Date(property.fechaInicio).toLocaleString()}</span></div>

            {role === 'Subastador' && (
              <>
                <div className="details-row"><span>Precio de reserva:</span><span>${property.precioReserva}</span></div>
                <div className="details-row"><span>Estatus:</span><span>{property.estado}</span></div>
              </>
            )}

            {role === 'Postor' && (
              <>
                <input
                  className="input-field"
                  type="number"
                  placeholder="Monto que deseas pujar"
                  name="bidAmount"
                  value={formValues.bidAmount}
                  onChange={handleChange}
                  disabled={!isAuctionActive}
                />
                <button
                  className="submit-button"
                  onClick={handleBidSubmit}
                  disabled={!isAuctionActive}
                  title={!isAuctionActive ? "La subasta no está activa" : ""}
                >
                  Pujar
                </button>
              </>
            )}
          </div>

          <div className="bid-history-box">
            <h3>Historial de pujas</h3>
            {pujas.length === 0 ? (
              <p>No hay pujas registradas aún.</p>
            ) : (
              <ul className="bid-history-list">
                {pujas.map((puja, index) => (
                  <li key={index} className="bid-entry">
                    <span><strong>{puja.usuarioNombre || 'Anónimo'}</strong> pujó</span>
                    <span>${puja.monto}</span>
                    <span>{new Date(puja.fecha).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showModal && role === 'Postor' && (
        <div className="modal-overlay">
          <div className="modal-content2">
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            <h2>Configurar puja automática</h2>
            <div className="config-modal">
              <input
                className="input-field"
                type="number"
                placeholder="Monto máximo"
                name="maxBid"
                value={formValues.maxBid}
                onChange={handleChange}
                disabled={!isAuctionActive}
              />
              <input
                className="input-field"
                type="number"
                placeholder="Incremento"
                name="increment"
                value={formValues.increment}
                onChange={handleChange}
                disabled={!isAuctionActive}
              />
              <button
                className="submit-button"
                onClick={() => alert('Configuración aún no implementada')}
                disabled={!isAuctionActive}
                title={!isAuctionActive ? "La subasta no está activa" : ""}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showInfoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            <div className="modal-body">
              <div className="modal-image-container">
                <img src={mainImage} alt="Subasta Detalle" className="modal-image" />
              </div>
              <div className="modal-info-container">
                <div className="modal-info-left">
                  <h2 className="modal-subasta-title">{property.nombre}</h2>
                  <p className="modal-subasta-description">
                    <strong>Descripción:</strong> {property.descripcion || 'Objeto de colección único, en excelente estado.'}
                  </p>
                </div>
                <div className="modal-info-right">
                  <p><strong>Creador de la subasta:</strong> {property.idUsuario || 'Usuario desconocido'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
