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
  const [recuerdos, setRecuerdos] = useState([]); // Contiene TODOS los recuerdos, es nuestra "base de datos"
  
  // --- 1. NUEVOS ESTADOS PARA CONTROLAR LA NAVEGACIÓN ---
  // 'listaActiva' es la lista que se muestra en el sidebar (puede ser la global o la de un lugar)
  const [listaActiva, setListaActiva] = useState([]);
  // 'indiceEnListaActiva' es el índice del recuerdo actual DENTRO de la listaActiva
  const [indiceEnListaActiva, setIndiceEnListaActiva] = useState(0);

  const mapRef = useRef(null);

  // Efecto para traer los datos de Firebase
  useEffect(() => {
    const q = query(collection(db, 'recuerdos'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recuerdosData = [];
      querySnapshot.forEach((doc) => {
        recuerdosData.push({ ...doc.data(), id: doc.id });
      });
      setRecuerdos(recuerdosData);
      
      // --- 2. ESTADO INICIAL POR DEFECTO ---
      // Al cargar, la lista activa es la lista completa de recuerdos.
      setListaActiva(recuerdosData);
      setIndiceEnListaActiva(0); // Empezamos en el primer recuerdo.
    });
    return () => unsubscribe();
  }, []);

  // ... (lógica de 'lugaresAgrupados' con useMemo sin cambios) ...
  const lugaresAgrupados = useMemo(() => {
    const lugares = {};
    recuerdos.forEach(recuerdo => {
      const key = `${recuerdo.coordenadas.lat}_${recuerdo.coordenadas.lng}`;
      if (!lugares[key]) {
        lugares[key] = {
          coordenadas: recuerdo.coordenadas,
          recuerdos: []
        };
      }
      lugares[key].recuerdos.push(recuerdo);
    });
    return Object.values(lugares);
  }, [recuerdos]);


  // --- 3. FUNCIONES DE NAVEGACIÓN ACTUALIZADAS ---
  // Ahora operan sobre la 'listaActiva', no sobre la lista global.
  const irSiguiente = () => {
    const nextIndex = (indiceEnListaActiva + 1) % listaActiva.length;
    setIndiceEnListaActiva(nextIndex);
  };

  const irAnterior = () => {
    const prevIndex = (indiceEnListaActiva - 1 + listaActiva.length) % listaActiva.length;
    setIndiceEnListaActiva(prevIndex);
  };
  
  // Obtenemos el recuerdo actual basándonos en la lista activa y su índice.
  const recuerdoActual = listaActiva[indiceEnListaActiva];

  // Efecto para centrar el mapa en el recuerdo actual
  useEffect(() => {
    if (mapRef.current && recuerdoActual) {
      const { lat, lng } = recuerdoActual.coordenadas;
      mapRef.current.flyTo([lat, lng], 14);
    }
  }, [recuerdoActual]); // Se ejecuta cada vez que 'recuerdoActual' cambia.


  if (!recuerdoActual) {
    return <div className="loading-screen">Cargando recuerdos...</div>;
  }

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
          
          {lugaresAgrupados.map((lugar, index) => {
            const popupText = lugar.recuerdos.length === 1
              ? lugar.recuerdos[0].titulo
              : `${lugar.recuerdos.length} recuerdos en este lugar`;

            return (
              <Marker
                key={`lugar-${index}`}
                position={[lugar.coordenadas.lat, lugar.coordenadas.lng]}
                // --- 4. LÓGICA DE CLIC ACTUALIZADA ---
                eventHandlers={{ click: () => {
                  // Al hacer clic, la lista activa ahora es la lista de este lugar.
                  setListaActiva(lugar.recuerdos);
                  // Y reseteamos el índice a 0 para mostrar el primer recuerdo del grupo.
                  setIndiceEnListaActiva(0);
                }}}
              >
                <Popup><b>{popupText}</b></Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="sidebar-container">
        {/* --- 5. RENDERIZADO DE LA LISTA DE RECUERDOS DEL LUGAR --- */}
        {/* Solo mostramos esta lista si la lista activa tiene más de un elemento */}
        {listaActiva.length > 1 && (
          <div className="lugar-lista-container">
            <h4>Recuerdos en este lugar:</h4>
            <ul>
              {listaActiva.map((recuerdo, index) => (
                <li 
                  key={recuerdo.id}
                  // Añadimos una clase 'activo' al recuerdo que está seleccionado
                  className={`lugar-lista-item ${index === indiceEnListaActiva ? 'activo' : ''}`}
                  // Al hacer clic en un item de la lista, actualizamos el índice
                  onClick={() => setIndiceEnListaActiva(index)}
                >
                  {recuerdo.titulo}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* El resto del sidebar ahora muestra los detalles del 'recuerdoActual' */}
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

        {/* Los botones de navegación ahora funcionan con la 'listaActiva' */}
        <div className="navigation-buttons">
          <button onClick={irAnterior} disabled={listaActiva.length <= 1}>
            &larr; Anterior
          </button>
          <span>{`${indiceEnListaActiva + 1} / ${listaActiva.length}`}</span>
          <button onClick={irSiguiente} disabled={listaActiva.length <= 1}>
            Siguiente &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}