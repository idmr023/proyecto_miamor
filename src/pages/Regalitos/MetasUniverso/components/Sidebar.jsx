// src/pages/MetasUniverso/components/Sidebar.jsx

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from 'firebase-config'; // Asegúrate que la ruta sea correcta
import MetaForm from './MetaForm';

export default function Sidebar({ mundos, selectedMundo, todasLasMetas }) {
  // Estado para controlar si estamos añadiendo una nueva meta
  const [isAddingMeta, setIsAddingMeta] = useState(false);
  
  const metasDelMundo = selectedMundo ? mundos[selectedMundo]?.metas || [] : [];

  // Función para guardar la nueva meta en Firebase
  const handleSaveMeta = async (nuevaMeta) => {
    try {
      await addDoc(collection(db, 'metas'), nuevaMeta);
      console.log('¡Meta añadida con éxito!');
      setIsAddingMeta(false); // Cerramos el formulario después de guardar
    } catch (error) {
      console.error("Error al añadir la meta: ", error);
      alert("Hubo un error al guardar la meta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="sidebar">
      {!selectedMundo ? (
        <div className="sidebar__placeholder">
          <p>Elige un mundo para ver las metas</p>
        </div>
      ) : isAddingMeta ? (
        // Si isAddingMeta es true, mostramos el formulario
        <MetaForm 
          onSave={handleSaveMeta}
          onCancel={() => setIsAddingMeta(false)}
          añoSeleccionado={selectedMundo}
          todasLasMetas={todasLasMetas}
        />
      ) : (
        // Si no, mostramos la lista de metas
        <div>
          <h2>Metas de {selectedMundo === 'agujero-negro' ? 'Metas sin Fecha' : `A4IO-${selectedMundo}`}</h2>
          
          {metasDelMundo.length > 0 ? (
            <ul className="sidebar__meta-lista">
              {metasDelMundo.map(meta => (
                <li key={meta.id} className="sidebar__meta-item">
                  <h3>{meta.titulo}</h3>
                  <p>{meta.descripcion}</p>
                  <div className="sidebar__meta-info">
                    <span>{meta.dificultad}</span>
                    <span>{meta.propietario}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sidebar__placeholder-text">Este mundo aún no tiene metas. ¡Añade la primera!</p>
          )}

          <button 
            className="sidebar__add-button" 
            onClick={() => setIsAddingMeta(true)} // Al hacer clic, abrimos el formulario
          >
            + Añadir Meta
          </button>
        </div>
      )}
    </div>
  );
}