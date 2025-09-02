import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import { db } from '../../../firebase-config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import ImageCarousel from '../../components/ImageCarousel';

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
    const q = query(collection(db, 'recuerdos'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recuerdosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTodosRecuerdos(recuerdosData);
      
      // Al cargar, la lista activa es la lista global
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
    return Object.values(lugares);
  }, [todosRecuerdos]);

  // Funciones de navegación (ahora son más genéricas)
  const navegar = (direccion) => {
    const total = listaActiva.length;
    const nuevoIndice = (indiceActivo + direccion + total) % total;
    setIndiceActivo(nuevoIndice);
  };
  
  const recuerdoActual = listaActiva[indiceActivo];

  useEffect(() => {
    if (mapRef.current && recuerdoActual) {
      const { lat, lng } = recuerdoActual.coordenadas;
      mapRef.current.flyTo([lat, lng], 14);
    }
  }, [recuerdoActual]);

  if (!recuerdoActual) {
    return <div className="loading-screen">Cargando recuerdos...</div>;
  }
  
  // Variable para saber si estamos en una vista de lugar específico
  const enVistaDeLugar = listaActiva.length > 1 && listaActiva !== todosRecuerdos;

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
                setListaActiva(lugar.recuerdos);
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
        {/* --- NUEVO ENCABEZADO DE NAVEGACIÓN CONTEXTUAL --- */}
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
                setListaActiva(todosRecuerdos);
                setIndiceActivo(0);
              }}
            >
              Ver todos los recuerdos
            </button>
          </div>
        )}

        {/* --- CONTENIDO PRINCIPAL DEL RECUERDO --- */}
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

        {/* --- NAVEGACIÓN GLOBAL (solo se muestra si no estamos en una vista de lugar) --- */}
        {!enVistaDeLugar && (
          <div className="navigation-buttons">
            <button onClick={() => navegar(-1)} disabled={listaActiva.length <= 1}>
              &larr; Anterior
            </button>
            <span>{`${indiceActivo + 1} / ${listaActiva.length}`}</span>
            <button onClick={() => navegar(1)} disabled={listaActiva.length <= 1}>
              Siguiente &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}