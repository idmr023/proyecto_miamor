// src/components/Mapa/Mapa.jsx

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

import { db } from '../../../firebase-config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Mapa() {
  const [recuerdos, setRecuerdos] = useState([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const mapRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'recuerdos'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recuerdosData = [];
      querySnapshot.forEach((doc) => {
        recuerdosData.push({ ...doc.data(), id: doc.id });
      });
      setRecuerdos(recuerdosData);
    });
    return () => unsubscribe();
  }, []);

  const irSiguiente = () => {
    const nextIndex = (currentIndex + 1) % recuerdos.length;
    setCurrentIndex(nextIndex);
  };

  const irAnterior = () => {
    // Calculamos el índice anterior, dando la vuelta si estamos en el inicio
    const prevIndex = (currentIndex - 1 + recuerdos.length) % recuerdos.length;
    setCurrentIndex(prevIndex);
  };

  useEffect(() => {
    if (mapRef.current && recuerdos.length > 0) {
      const recuerdoActual = recuerdos[currentIndex];
      const { lat, lng } = recuerdoActual.coordenadas;
      mapRef.current.flyTo([lat, lng], 14);
    }
  }, [currentIndex, recuerdos]);

  if (recuerdos.length === 0) {
    return <div className="loading-screen">Cargando recuerdos...</div>;
  }

  const recuerdoActual = recuerdos[currentIndex];

  return (
    <div className="map-page-container">
      <div className="map-container">
        <MapContainer
          whenCreated={map => (mapRef.current = map)}
          center={[recuerdoActual.coordenadas.lat, recuerdoActual.coordenadas.lng]}
          zoom={14}
          scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {recuerdos.map((recuerdo, index) => (
            <Marker
              key={recuerdo.id}
              position={[recuerdo.coordenadas.lat, recuerdo.coordenadas.lng]}
              eventHandlers={{ click: () => setCurrentIndex(index) }}>
              <Popup>
                <b>{recuerdo.titulo}</b>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="sidebar-container">
        <h2>{recuerdoActual.titulo}</h2>
        <p className="sidebar-date">
          {recuerdoActual.fecha &&
            recuerdoActual.fecha.toDate().toLocaleDateString('es-ES', {
              year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
            })}
        </p>
        {recuerdoActual.fotos && recuerdoActual.fotos.length > 0 && (
          <img
            src={recuerdoActual.fotos[0]}
            alt={recuerdoActual.titulo}
            className="sidebar-image"
          />
        )}
        <p className="sidebar-description">{recuerdoActual.descripcion}</p>

        <div className="navigation-buttons">
          <button onClick={irAnterior} disabled={recuerdos.length <= 1}>
            &larr; Anterior
          </button>

          <button onClick={irSiguiente} disabled={recuerdos.length <= 1}>
            Siguiente &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}