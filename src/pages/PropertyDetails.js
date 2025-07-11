import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import keycloak from '../keycloak';
import './PropertyDetails.css';
import subastaImg from './img/subastadetailprueba.jpg';
import subastaImg1 from './img/subastadetailprueba1.jpg';
import subastaImg2 from './img/subastadetailprueba2.jpg';
import subastaImg3 from './img/subastadetailprueba3.jpg';
import subastaImg4 from './img/subastadetailprueba4.jpg';
import subastaImg5 from './img/subastadetailprueba5.jpg';
import bidSound from './img/bid.mp3';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formValues, setFormValues] = useState({
    maxBid: '',
    bidAmount: ''
  });
  const [pujas, setPujas] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [alertaPuja, setAlertaPuja] = useState(null);
  const [showReclamoModal, setShowReclamoModal] = useState(false);
const [reclamoTexto, setReclamoTexto] = useState('');
const [motivoReclamo, setMotivoReclamo] = useState('');
  const bidAudio = new Audio(bidSound);
bidAudio.volume = 0.5; // volumen moderado


  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const role = roles.includes('subastador') ? 'Subastador' : 'Postor';

  const isAuctionActive = property?.estado === 'Active';

 const fetchSubasta = async () => {
  try {
    const response = await axios.get(`http://localhost:5118/subastas/api/Subastas/buscar/${id}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });

    console.log(response);
    setProperty(response.data);

    // 🔽 Declarar y llamar a fetchProducto aquí
    const fetchProducto = async (idProducto) => {
      try {
        const response = await axios.get(`http://localhost:5118/productos/api/ProductosControlador/buscar/${idProducto}`, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        });

        const imagenUrl = response.data.imagenRuta
          ? `http://localhost:5101${response.data.imagenRuta}`
          : null;

          console.log(imagenUrl);

          console.log(response);
        if (imagenUrl) setMainImage(imagenUrl);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    if (response.data.idProducto) {
      await fetchProducto(response.data.idProducto);
    }

  } catch (error) {
    setError('No se pudo cargar la subasta.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  const fetchPujas = async () => {
  try {
    const response = await axios.get(`http://localhost:5118/pujas/api/Pujas/subasta/${id}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    });
    console.log(response.data);
    console.log("🧩 id desde URL que NO funciona:", id);

    const enriched = await enrichPujasWithUserNames(response.data);
    // ⬇️ AÑADE esta línea para ordenar descendente por fecha
    console.log("PUJAS ENRIQUECIDAS:", enriched);
    setPujas(enriched.sort((a, b) => b.monto - a.monto));
  } catch (error) {
    console.error('Error al obtener las pujas:', error);
  }
};

  const fetchUserEmail = async (email) => {
    if (userMap[email]) return userMap[email];
    try {
      const res = await axios.get(`http://localhost:5118/usuarios/api/User/by-email?email=${email}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });
      const usuario = res.data;
      const nombre = usuario?.nombre ?? 'Usuario';
      setUserMap(prev => ({ ...prev, [email]: nombre }));
      return nombre;
    } catch {
      return 'Usuario';
    }
  };

  const enrichPujasWithUserNames = async (pujasList) => {
    const enriched = await Promise.all(
      pujasList.map(async (puja) => {
        if (!puja.usuarioNombre && puja.usuarioId) {
          puja.usuarioNombre = await fetchUserEmail(puja.usuarioId);
        }
        return puja;
      })
    );
    return enriched;
  };

  useEffect(() => {
  fetchSubasta();
  fetchPujas();

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5042/pujashub", {
      accessTokenFactory: () => keycloak.token
    })
    .withAutomaticReconnect()
    .build();

  // 🔊 Crear audio dentro del efecto
  const bidAudio = new Audio(bidSound);  // ← asegúrate de importar bidSound arriba
  bidAudio.volume = 0.5;

  connection
    .start()
    .then(() => {
      console.log("✅ Conectado a SignalR");
      connection.invoke("UnirseASubasta", id);

      connection.on("NuevaPuja", async (puja) => {
        if (!puja.usuarioNombre && puja.usuarioId) {
          puja.usuarioNombre = await fetchUserEmail(puja.usuarioId);
        }

        setPujas(prev => {
          const updated = [...prev, puja];
          return updated.sort((a, b) => b.monto - a.monto);
        });

        // Solo reproducir si no es tu propia puja (opcional)
        if ((puja.usuarioId || puja.idUsuario) !== keycloak.tokenParsed?.email) {
          try {
            await bidAudio.play(); // 🔊 Reproduce sonido
          } catch (error) {
            console.warn("No se pudo reproducir el sonido:", error);
          }
        }

        setAlertaPuja(`💰 Nueva puja de ${puja.usuarioNombre || puja.idUsuario} por $${puja.monto}`);
        setTimeout(() => setAlertaPuja(null), 4000);
      });
    })
    .catch(err => console.error("Error al conectar con SignalR:", err));

  return () => {
    connection.stop();
  };
}, [id]);


  const handleChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGearClick = () => setShowModal(true);
  const reclamoModalClick = () => setShowReclamoModal(true);
  const handleMoreInfoClick = () => setShowInfoModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShowInfoModal(false);
  };

  const handleBidSubmit = async () => {
    const { bidAmount } = formValues;
    const email = keycloak.tokenParsed?.email;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      alert('Por favor, ingresa un monto válido para pujar.');
      return;
    }

      const montoIngresado = Number(bidAmount);
const montoMinimoPermitido = highestBid + property.incrementoMinimo;

if (montoIngresado < montoMinimoPermitido) {
  alert(`La puja debe ser al menos $${montoMinimoPermitido}`);
  return;
}

    const bidData = {
      subastaId: id,
      usuarioId: email,
      monto: Number(bidAmount)
    };

  

    try {
      const response = await axios.post('http://localhost:5118/pujas/api/Pujas/registrarPuja', bidData, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });

      if (response.status === 200 || response.status === 201) {
        alert('Puja registrada con éxito');
        setFormValues(prev => ({ ...prev, bidAmount: '' }));
      } else {
        alert('Error al registrar la puja');
      }
    } catch (error) {
      console.error('Error al enviar la puja:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  };

  const handleAutoBidSubmit = async () => {
    const email = keycloak.tokenParsed?.email;
    const { maxBid } = formValues;

    if (!maxBid || isNaN(maxBid)) {
      alert('Ingresa un monto máximo válido.');
      return;
    }

    const data = {
      subastaId: id,
      usuarioId: email,
      montoMaximo: Number(maxBid),
      incremento: property.incrementoMinimo
    };

    try {
      const res = await axios.post(
        'http://localhost:5118/pujas/api/Pujas/registrarPujaAutomatica',
        data,
        {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        }
      );

      if (res.status === 200 || res.status === 201) {
        alert('✅ Puja automática registrada con éxito.');
        setShowModal(false);
      } else {
        alert('⚠️ No se pudo registrar la puja automática.');
      }
    } catch (error) {
      console.error('Error al registrar puja automática:', error);
      alert('❌ Error al conectar con el servidor.');
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
          <button className="more-info-button" onClick={handleMoreInfoClick}>Más información</button>
        </div>

        <div className="property-details-right">
          <div className="current-bid-box">
            <div className="gear-icon" onClick={reclamoModalClick} title="Crear Reporte">⚙️</div>
            {role === 'Postor' && (
              <div className="gear-icon" onClick={handleGearClick} title="Configurar puja automática">⚙️</div>
            )}
            <h2>Puja actual</h2>
            <div className="amount">${highestBid}</div>
            <div className="details-row"><span>Monto base:</span><span>${property.precioBase}</span></div>
            {role === 'Postor' && <div className="details-row"><span>Precio de reserva:</span><span>${property.precioReserva}</span></div>}
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
                    <span><strong>{puja.usuarioNombre || puja.idUsuario}</strong> pujó  </span>
                    <span>${puja.monto}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
          onClick={() => setShowReclamoModal(true)}
          className="submit-button"
          style={{ marginTop: '15px' }}
        >
        📢 Registrar reclamo
            </button>
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
              <button className="submit-button" onClick={handleAutoBidSubmit} disabled={!isAuctionActive}>
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


      {showReclamoModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={() => setShowReclamoModal(false)}>&times;</button>
      <h2>Registrar reclamo</h2>
      <input
        type="text"
        placeholder="Motivo del reclamo"
        value={motivoReclamo}
        onChange={(e) => setMotivoReclamo(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <textarea
        value={reclamoTexto}
        onChange={(e) => setReclamoTexto(e.target.value)}
        placeholder="Describe el motivo del reclamo"
        rows="5"
        style={{ width: '100%', padding: '10px' }}
      />
      <button
        className="submit-button"
        onClick={async () => {
          try {
            const data = {
              usuarioId: keycloak.tokenParsed?.email,
              subastaId: id,            
              motivo: motivoReclamo,
              descripcion: reclamoTexto
            };

            await axios.post('http://localhost:5118/reclamos/api/reclamos', data, {
              headers: { Authorization: `Bearer ${keycloak.token}` }
            });

            alert('✅ Reclamo registrado correctamente.');
            setShowReclamoModal(false);
            setReclamoTexto('');
          } catch (error) {
            console.error('Error al registrar reclamo:', error);
            alert('❌ Hubo un error al registrar el reclamo.');
          }
        }}
        disabled={!reclamoTexto.trim()}
        style={{ marginTop: '10px' }}
      >
        Enviar reclamo
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default PropertyDetails;
