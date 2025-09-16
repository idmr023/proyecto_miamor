// src/pages/Herramientas/ListaRegalos/ListaRegalos.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './ListaRegalos.css'; // Usaremos un nuevo CSS
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

// Componente reutilizable para un item de regalo (similar al de Actividades)
const RegaloItem = ({ item, onDelete, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = async () => {
    setIsEditing(false);
    if (editText.trim() !== item.text && editText.trim() !== '') {
      await onTextChange(item.id, editText);
    } else {
      setEditText(item.text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
    else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(item.text);
    }
  };

  return (
    <div
      className="item"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
    >
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
      <button className="item-delete-btn" onClick={() => onDelete(item.id)}>🎁</button>
    </div>
  );
};

// Componente principal de la página
export default function ListaRegalos() {
  const [todosLosRegalos, setTodosLosRegalos] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState('');
  // Estado para el filtro al añadir un nuevo regalo
  const [filtroParaQuien, setFiltroParaQuien] = useState('ivan');

  const regalosCollectionRef = collection(db, 'regalos');

  // Carga los regalos ordenados por fecha
  useEffect(() => {
    const q = query(regalosCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const regalosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTodosLosRegalos(regalosData);
    });
    return () => unsubscribe();
  }, []);

  // Agrupa los regalos en las tres columnas
  const regalosAgrupados = useMemo(() => {
    const grupos = {
      para_ivan: [],
      para_antok: [],
      conseguidos: [],
    };
    todosLosRegalos.forEach(item => {
      if (item.status === 'conseguido') {
        grupos.conseguidos.push(item);
      } else if (item.paraQuien === 'ivan') {
        grupos.para_ivan.push(item);
      } else if (item.paraQuien === 'antok') {
        grupos.para_antok.push(item);
      }
    });
    return grupos;
  }, [todosLosRegalos]);
  
  // --- FUNCIONES DE MANEJO DE DATOS ---

  const addItem = async () => {
    if (!nuevoTexto.trim()) return;
    await addDoc(regalosCollectionRef, {
      text: nuevoTexto,
      paraQuien: filtroParaQuien,
      status: 'pendiente', // Por defecto, todos los regalos están pendientes
      createdAt: serverTimestamp(),
    });
    setNuevoTexto('');
  };

  const deleteItem = async (id) => {
    const itemDoc = doc(db, 'regalos', id);
    await deleteDoc(itemDoc);
  };
  
  const updateItemText = async (id, newText) => {
    const itemDoc = doc(db, 'regalos', id);
    await updateDoc(itemDoc, { text: newText });
  };

  // --- FUNCIONES DE DRAG AND DROP ---

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const itemDoc = doc(db, 'regalos', draggedItemId);
    
    // Lógica para actualizar el estado al mover
    if (targetColumn === 'conseguidos') {
      await updateDoc(itemDoc, { status: 'conseguido' });
    } else {
      // Si se mueve a una columna de persona, actualizamos para quién es
      // y nos aseguramos de que el estado vuelva a ser 'pendiente'
      const paraQuien = targetColumn === 'para_ivan' ? 'ivan' : 'antok';
      await updateDoc(itemDoc, { paraQuien: paraQuien, status: 'pendiente' });
    }
  };

  const allowDrop = (e) => e.preventDefault();
  
  const columnas = [
    { id: 'para_ivan', titulo: 'Regalos para Iván' },
    { id: 'para_antok', titulo: 'Regalos para Antok' },
    { id: 'conseguidos', titulo: 'Conseguidos 🎉' }
  ];

  return (
    <>
      <Navbar />
      <div className="regalos-container">
        <h2 className="regalos-title">Lista de Regalos</h2>

        <div className="input-card">
          <input
            type="text"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Añadir nuevo regalo..."
          />
          <div className="input-group">
            <label htmlFor="filtro-persona">Para:</label>
            <select 
              id="filtro-persona" 
              value={filtroParaQuien} 
              onChange={(e) => setFiltroParaQuien(e.target.value)}
            >
              <option value="ivan">Iván</option>
              <option value="antok">Antok</option>
            </select>
          </div>
          <button className="add-button" onClick={addItem}>Agregar</button>
        </div>

        <div className="kanban-board">
          {columnas.map(({ id, titulo }) => (
            <div
              key={id}
              className="kanban-column"
              onDrop={(e) => handleDrop(e, id)}
              onDragOver={allowDrop}
            >
              <h3 className="column-title">{titulo}</h3>
              <div className="column-content">
                {regalosAgrupados[id].map((item) => (
                  <RegaloItem 
                    key={item.id}
                    item={item}
                    onDelete={deleteItem}
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