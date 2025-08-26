import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase-config'; // Asegúrate que la ruta sea correcta

import LoadingModal from './components/LoadingModal';
import UniversoCanvas from './components/UniversoCanvas';
import Sidebar from './components/Sidebar';
import { Navbar } from 'components/NavBar/NavBar'; // Importas tu Navbar existente
import { groupMetasByYear } from './utils/goalUtils';

import './MetasUniverso.css';

export default function MetasUniverso() {
  const [showLoadingModal, setShowLoadingModal] = useState(true);
  const [metas, setMetas] = useState([]);
  const [selectedMundo, setSelectedMundo] = useState(null); // '2025', 'agujero-negro', etc.

  // Carga las metas desde Firebase en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'metas'), orderBy('año', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const metasData = [];
      querySnapshot.forEach((doc) => {
        metasData.push({ ...doc.data(), id: doc.id });
      });
      setMetas(metasData);
    });
    return () => unsubscribe();
  }, []);

  // Agrupa las metas por año usando useMemo para optimizar
  const mundos = useMemo(() => groupMetasByYear(metas), [metas]);

  if (showLoadingModal) {
    return <LoadingModal onFinished={() => setShowLoadingModal(false)} />;
  }

  return (
      <>
        <Navbar />
        <div className="universo-container">
          <UniversoCanvas
            mundos={mundos}
            onSelectMundo={setSelectedMundo}
            selectedMundo={selectedMundo}
          />
          <Sidebar
            mundos={mundos}
            selectedMundo={selectedMundo}
            todasLasMetas={metas}
          />
        </div>
      </>
    );
}