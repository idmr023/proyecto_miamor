import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import { db } from '../../../firebase-config'; // Asegúrate que la ruta sea correcta
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import ImageCarousel from 'components/ImageCarrousel';

// Configuración para arreglar el icono por defecto de Leaflet
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

  // Efecto para traer los datos de Firebase y ordenarlos por fecha
  useEffect(() => {
    const q = query(collection(db, 'recuerdos'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recuerdosData = [];
      querySnapshot.forEach((doc) => {
        recuerdosData.push({ ...doc.data(), id: doc.id });
      });
      setRecuerdos(recuerdosData);
    });
    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Lógica de agrupación de recuerdos por coordenadas
  const lugaresAgrupados = useMemo(() => {
    const lugares = {};
    recuerdos.forEach(recuerdo => {
      // Creamos una clave única para cada coordenada
      const key = `${recuerdo.coordenadas.lat}_${recuerdo.coordenadas.lng}`;
      if (!lugares[key]) {
        // Si es la primera vez que vemos este lugar, lo inicializamos
        lugares[key] = {
          coordenadas: recuerdo.coordenadas,
          recuerdos: []
        };
      }
      // Añadimos el recuerdo a la lista de este lugar
      lugares[key].recuerdos.push(recuerdo);
    });
    return Object.values(lugares); // Devolvemos un array de objetos de lugar
  }, [recuerdos]);

  // Funciones para la navegación del carrusel en el sidebar
  const irSiguiente = () => {
    const nextIndex = (currentIndex + 1) % recuerdos.length;
    setCurrentIndex(nextIndex);
  };

  const irAnterior = () => {
    const prevIndex = (currentIndex - 1 + recuerdos.length) % recuerdos.length;
    setCurrentIndex(prevIndex);
  };

  // Efecto para centrar el mapa en el marcador del recuerdo actual
  useEffect(() => {
    if (mapRef.current && recuerdos.length > 0) {
      const recuerdoActual = recuerdos[currentIndex];
      const { lat, lng } = recuerdoActual.coordenadas;
      mapRef.current.flyTo([lat, lng], 14); // 14 es el nivel de zoom
    }
  }, [currentIndex, recuerdos]);

  // Si aún no se han cargado los recuerdos, mostramos un mensaje
  if (recuerdos.length === 0) {
    return <div className="loading-screen">Cargando recuerdos...</div>;
  }

  // Obtenemos el objeto del recuerdo actual usando el índice
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
          
          {/* Mapeamos sobre los lugares agrupados para renderizar los marcadores */}
          {lugaresAgrupados.map((lugar, index) => {
            // Lógica para determinar el texto del Popup
            let popupText;
            if (lugar.recuerdos.length === 1) {
              popupText = lugar.recuerdos[0].titulo;
            } else {
              popupText = `${lugar.recuerdos.length} recuerdos en este lugar`;
            }

            return (
              <Marker
                key={`lugar-${index}`}
                position={[lugar.coordenadas.lat, lugar.coordenadas.lng]}
                // Al hacer clic en un marcador, seleccionamos el primer recuerdo de ese lugar
                eventHandlers={{ click: () => {
                  const primerRecuerdoDelLugar = lugar.recuerdos[0];
                  const newIndex = recuerdos.findIndex(r => r.id === primerRecuerdoDelLugar.id);
                  if (newIndex !== -1) {
                    setCurrentIndex(newIndex);
                  }
                }}}
              >
                <Popup><b>{popupText}</b></Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="sidebar-container">
        {/* Lógica para mostrar un aviso si hay varios recuerdos en el mismo lugar */}
        {(() => {
          const recuerdosEnMismoLugar = lugaresAgrupados
            .find(l => l.recuerdos.some(r => r.id === recuerdoActual.id))?.recuerdos || [];

          return (
            <>
              {recuerdosEnMismoLugar.length > 1 && (
                <div className="lugar-compartido-aviso">
                  Hay {recuerdosEnMismoLugar.length} recuerdos en este lugar.
                </div>
              )}
              <h2>{recuerdoActual.titulo}</h2>
            </>
          );
        })()}

        <p className="sidebar-date">
          {recuerdoActual.fecha &&
            recuerdoActual.fecha.toDate().toLocaleDateString('es-ES', {
              year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
            })}
        </p>
        
        {recuerdoActual.fotos && recuerdoActual.fotos.length > 0 && (
          <ImageCarousel images={recuerdoActual.fotos} />
        )}

        <p className="sidebar-description">{recuerdoActual.descripcion}</p>

        <div className="navigation-buttons">
          <button onClick={irAnterior} disabled={recuerdos.length <= 1}>
            &larr; Anterior
          </button>
          <span>{`${currentIndex + 1} / ${recuerdos.length}`}</span>
          <button onClick={irSiguiente} disabled={recuerdos.length <= 1}>
            Siguiente &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}