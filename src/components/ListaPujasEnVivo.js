import React, { useEffect, useState } from 'react';
import { obtenerPujasPorSubasta } from '../pages/PujasService';

const ListaPujasEnVivo = ({ idSubasta }) => {
  const [pujas, setPujas] = useState([]);

  useEffect(() => {
    const fetchPujas = async () => {
      const data = await obtenerPujasPorSubasta(idSubasta);
      setPujas(data);
    };

    fetchPujas(); // primera carga

    const interval = setInterval(fetchPujas, 5000); // polling

    return () => clearInterval(interval);
  }, [idSubasta]);

  return (
    <div className="mt-3">
      <h6 className="fw-bold">Pujas en vivo:</h6>
      {pujas.length > 0 ? (
        <ul className="list-group list-group-flush">
          {pujas.map((p, index) => (
            <li key={index} className="list-group-item px-2 py-1">
              <strong>{p.nombreUsuario || 'Usuario'}:</strong> ${p.monto}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Aún no hay pujas.</p>
      )}
    </div>
  );
};

export default ListaPujasEnVivo;
