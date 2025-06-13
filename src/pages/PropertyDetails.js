// Mismo encabezado sin cambios
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import properties from '../data/properties';
import './PropertyDetails.css';
import subastaImg from './img/subastadetailprueba.jpg';
import subastaImg1 from './img/subastadetailprueba1.jpg';
import subastaImg2 from './img/subastadetailprueba2.jpg';
import subastaImg3 from './img/subastadetailprueba3.jpg';
import subastaImg4 from './img/subastadetailprueba4.jpg';
import subastaImg5 from './img/subastadetailprueba5.jpg';

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));
  const role = 'Postor'; // Cambiar a 'Subastador' para pruebas

  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formValues, setFormValues] = useState({
    maxBid: '',
    increment: '',
    bidAmount: ''
  });

  const [mainImage, setMainImage] = useState(subastaImg);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  if (!property) return <h1>Propiedad no encontrada</h1>;

  const handleBidSubmit = async () => {
    const { bidAmount } = formValues;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      alert('Por favor, ingresa un monto válido para pujar.');
      return;
    }

    const bidData = {
      propertyId: property.id,
      amount: bidAmount,
      userId: 'usuarioID' // Sustituir por el real
    };

    try {
      const response = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData)
      });

      if (response.ok) {
        alert('Puja registrada con éxito');
      } else {
        alert('Error al registrar la puja');
      }
    } catch (error) {
      console.error('Error al enviar la puja:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  };

  return (
    <div className="property-details-container">
      <h1 className="property-title">{property.title}</h1>

      <div className="property-details-content">
        <div className="property-details-left">
          <img src={mainImage} alt="Subasta Detalle" className="property-details-image" />

          {/* Miniaturas */}
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
            <div className="amount">$1,200.00</div>

            <div className="details-row"><span>Monto base:</span><span>$1,000.00</span></div>
            {role === 'Postor' && (
              <div className="details-row"><span>Precio de reserva:</span><span>$1,500.00</span></div>
            )}
            <div className="details-row"><span>Incremento mínimo:</span><span>$50.00</span></div>
            <div className="details-row"><span>Fecha/Hora de inicio:</span><span>{currentTime.toLocaleString()}</span></div>

            {role === 'Subastador' && (
              <>
                <div className="details-row"><span>Precio de reserva:</span><span>$1,500.00</span></div>
                <div className="details-row"><span>Estatus:</span><span>Activo</span></div>
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
                />
                <button className="submit-button" onClick={handleBidSubmit}>
                  Pujar
                </button>
              </>
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
              />
              <input
                className="input-field"
                type="number"
                placeholder="Incremento"
                name="increment"
                value={formValues.increment}
                onChange={handleChange}
              />
              <button className="submit-button" onClick={() => alert('Configuración aún no implementada')}>
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
                  <h2 className="modal-subasta-title">{property.title}</h2>
                  <p className="modal-subasta-description">
                    <strong>Descripción:</strong> {property.description || 'Objeto de colección único, en excelente estado.'}
                  </p>
                </div>
                <div className="modal-info-right">
                  <p><strong>Creador de la subasta:</strong> Juan Pérez</p>
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
