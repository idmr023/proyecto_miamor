// src/pages/Herramientas/ListaActividades/Actividades.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './Actividades.css';
import { Navbar } from 'components/NavBar/NavBar';

import { db } from '../../../firebase-config';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Componente para un item individual de la lista
const ActividadItem = ({ item, onDelete, onStatusChange, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    if (editText.trim() !== item.text && editText.trim() !== '') {
      await onTextChange(item.id, editText);
    } else {
      setEditText(item.text); // Revierte si no hay cambios o está vacío
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(item.text);
    }
  };

  return (
    <div
      className={`item ${item.status === 'completada' ? 'completada' : ''}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
    >
      <div className="item-status-icon" onClick={() => onStatusChange(item.id, item.status)}>
        {item.status === 'completada' ? '✔' : ''}
      </div>

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="item-edit-input"
        />
      ) : (
        <span className="item-text" onDoubleClick={handleDoubleClick}>
          {item.text}
        </span>
      )}
      
      <button className="item-delete-btn" onClick={() => onDelete(item.id)}>❌</button>
    </div>
  );
};


// Componente principal de la página
export default function Actividades() {
  const [todasLasActividades, setTodasLasActividades] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState('');

  const itemsCollectionRef = collection(db, 'actividades');

  // Carga las actividades ordenadas por fecha de creación
  useEffect(() => {
    const q = query(itemsCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const actividadesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTodasLasActividades(actividadesData);
    });
    return () => unsubscribe();
  }, []);

  // Agrupa las actividades por estado usando useMemo para optimizar
  const actividadesAgrupadas = useMemo(() => {
    const grupos = {
      por_iniciar: [],
      en_desarrollo: [],
      completada: [],
    };
    todasLasActividades.forEach(item => {
      if (grupos[item.status]) {
        grupos[item.status].push(item);
      }
    });
    return grupos;
  }, [todasLasActividades]);

  // --- FUNCIONES DE MANEJO DE DATOS ---

  const addItem = async () => {
    if (!nuevoTexto.trim()) return;
    await addDoc(itemsCollectionRef, {
      text: nuevoTexto,
      status: 'por_iniciar', // Por defecto, las nuevas tareas van a 'por_iniciar'
      createdAt: serverTimestamp(), // Guarda la fecha del servidor
    });
    setNuevoTexto('');
  };

  const deleteItem = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      const itemDoc = doc(db, 'actividades', id);
      await deleteDoc(itemDoc);
    }
  };

  const updateItemStatus = async (id, currentStatus) => {
    const itemDoc = doc(db, 'actividades', id);
    // Si la tarea no está completada, la marca como completada. Si ya lo está, la revierte a 'por_iniciar'.
    const newStatus = currentStatus === 'completada' ? 'por_iniciar' : 'completada';
    await updateDoc(itemDoc, { status: newStatus });
  };
  
  const updateItemText = async (id, newText) => {
    const itemDoc = doc(db, 'actividades', id);
    await updateDoc(itemDoc, { text: newText });
  };

  // --- FUNCIONES DE DRAG AND DROP ---

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const itemDoc = doc(db, 'actividades', draggedItemId);
    await updateDoc(itemDoc, { status: newStatus });
  };

  const allowDrop = (e) => e.preventDefault();
  
  const estados = [
    { id: 'por_iniciar', titulo: 'Listos para Iniciar' },
    { id: 'en_desarrollo', titulo: 'En Desarrollo' },
    { id: 'completada', titulo: 'Completadas' }
  ];

  return (
    <>
      <Navbar />
      <div className="actividades-container">
        <h2 className="actividades-title">Lista de Actividades</h2>

        <div className="input-card">
          <input
            type="text"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Añadir nueva tarea..."
          />
          <button className="add-button" onClick={addItem}>Agregar</button>
        </div>

        <div className="kanban-board">
          {estados.map(({ id, titulo }) => (
            <div
              key={id}
              className="kanban-column"
              onDrop={(e) => handleDrop(e, id)}
              onDragOver={allowDrop}
            >
              <h3 className="column-title">{titulo}</h3>
              <div className="column-content">
                {actividadesAgrupadas[id].map((item) => (
                  <ActividadItem 
                    key={item.id}
                    item={item}
                    onDelete={deleteItem}
                    onStatusChange={updateItemStatus}
                    onTextChange={updateItemText}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}