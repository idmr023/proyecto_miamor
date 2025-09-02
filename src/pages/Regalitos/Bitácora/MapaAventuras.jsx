import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import { db } from '../../../firebase-config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import ImageCarousel from 'components/ImageCarrousel';

// ... (configuración del icono de Leaflet sin cambios) ...
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Mapa() {
  const [todosRecuerdos, setTodosRecuerdos] = useState([]);
  const [listaActiva, setListaActiva] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. CAMBIO AQUÍ: Ordenamos por fecha ascendente ('asc') para empezar por el más antiguo.
    const q = query(collection(db, 'recuerdos'), orderBy('fecha', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recuerdosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTodosRecuerdos(recuerdosData);
      
      // La lista activa por defecto será la lista global, empezando por la primera cita.
      setListaActiva(recuerdosData);
      setIndiceActivo(0);
    });
    return () => unsubscribe();
  }, []);

  const lugaresAgrupados = useMemo(() => {
    const lugares = {};
    todosRecuerdos.forEach(recuerdo => {
      const key = `${recuerdo.coordenadas.lat}_${recuerdo.coordenadas.lng}`;
      if (!lugares[key]) {
        lugares[key] = { coordenadas: recuerdo.coordenadas, recuerdos: [] };
      }
      lugares[key].recuerdos.push(recuerdo);
    });

    // 2. CAMBIO AQUÍ: Nos aseguramos de que los recuerdos DENTRO de cada grupo
    // también estén ordenados del más antiguo al más nuevo.
    Object.values(lugares).forEach(lugar => {
      lugar.recuerdos.sort((a, b) => a.fecha.toDate() - b.fecha.toDate());
    });

    return Object.values(lugares);
  }, [todosRecuerdos]);

  // Funciones de navegación (sin cambios)
  const navegar = (direccion) => {
    const total = listaActiva.length;
    const nuevoIndice = (indiceActivo + direccion + total) % total;
    setIndiceActivo(nuevoIndice);
  };
  
  const recuerdoActual = listaActiva[indiceActivo];

  // Efecto para centrar el mapa (sin cambios)
  useEffect(() => {
    if (mapRef.current && recuerdoActual) {
      const { lat, lng } = recuerdoActual.coordenadas;
      mapRef.current.flyTo([lat, lng], 14);
    }
  }, [recuerdoActual]);

  if (!recuerdoActual) {
    return <div className="loading-screen">Cargando recuerdos...</div>;
  }
  
  const enVistaDeLugar = listaActiva !== todosRecuerdos;

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
          
          {lugaresAgrupados.map((lugar, index) => (
            <Marker
              key={`lugar-${index}`}
              position={[lugar.coordenadas.lat, lugar.coordenadas.lng]}
              eventHandlers={{ click: () => {
                setListaActiva(lugar.recuerdos); // La lista ya viene ordenada
                setIndiceActivo(0);
              }}}
            >
              <Popup>
                <b>
                  {lugar.recuerdos.length === 1
                    ? lugar.recuerdos[0].titulo
                    : `${lugar.recuerdos.length} recuerdos en este lugar`}
                </b>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="sidebar-container">
        {/* Encabezado contextual (ligeramente modificado para mayor claridad) */}
        {enVistaDeLugar && (
          <div className="lugar-navegacion-header">
            <h4>Recuerdo {indiceActivo + 1} de {listaActiva.length} en este lugar</h4>
            <div className="mini-nav-buttons">
              <button onClick={() => navegar(-1)}>‹</button>
              <button onClick={() => navegar(1)}>›</button>
            </div>
            <button
              className="btn-ver-todos"
              onClick={() => {
                // Al volver a la vista global, la reseteamos al recuerdo más antiguo
                setListaActiva(todosRecuerdos);
                setIndiceActivo(0);
              }}
            >
              Ver todos los recuerdos
            </button>
          </div>
        )}

        {/* Contenido principal del recuerdo (sin cambios) */}
        <div className="sidebar-content">
          <h2>{recuerdoActual.titulo}</h2>
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
        </div>

        {/* Navegación global (ligeramente modificada para mayor claridad) */}
        {!enVistaDeLugar && (
          <div className="navigation-buttons">
            <button onClick={() => navegar(-1)} disabled={listaActiva.length <= 1}>
              &larr; Anterior
            </button>
            <span>{`Recuerdo ${indiceActivo + 1} / ${listaActiva.length}`}</span>
            <button onClick={() => navegar(1)} disabled={listaActiva.length <= 1}>
              Siguiente &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}