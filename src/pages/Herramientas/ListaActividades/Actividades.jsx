// src/pages/Herramientas/ListaActividades/Actividades.jsx

import React, { useState, useEffect } from 'react';
import './Actividades.css';
import { Navbar } from 'components/NavBar/NavBar';

// 1. Importa todo lo necesario de Firebase
import { db } from '../../../firebase-config'; // Asegúrate de que la ruta sea correcta
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export default function Actividades() {
  // El estado local ahora solo guarda los datos, pero no los gestiona
  const [items, setItems] = useState({ gratis: [], moderado: [], caro: [] });
  const [lugar, setLugar] = useState('');
  const [categoria, setCategoria] = useState('gratis');

  // La referencia a nuestra colección en Firestore
  const itemsCollectionRef = collection(db, 'actividades');

  // 2. useEffect para escuchar cambios en TIEMPO REAL desde Firestore
  useEffect(() => {
    const q = query(itemsCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allItems = { gratis: [], moderado: [], caro: [] };
      querySnapshot.forEach((doc) => {
        const itemData = { ...doc.data(), id: doc.id };
        if (allItems[itemData.category]) {
          allItems[itemData.category].push(itemData);
        }
      });
      setItems(allItems);
    });

    // Limpiamos el 'listener' cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar

  // 3. Funciones adaptadas a Firestore (todas son async ahora)
  const addItem = async () => {
    if (!lugar.trim()) return;
    await addDoc(itemsCollectionRef, { text: lugar, category: categoria });
    setLugar('');
  };

  const editItem = async (id, currentText) => {
    const nuevoTexto = prompt('Editar lugar:', currentText);
    if (nuevoTexto === null || !nuevoTexto.trim()) return;
    const itemDoc = doc(db, 'actividades', id);
    await updateDoc(itemDoc, { text: nuevoTexto });
  };

  const deleteItem = async (id) => {
    const itemDoc = doc(db, 'actividades', id);
    await deleteDoc(itemDoc);
  };
  
  // La función de duplicar ahora es innecesaria con Firebase, ¡pero la dejamos por si la quieres!
  // Podrías adaptarla para que también cree un nuevo documento en Firestore.

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = async (e, targetCat) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const itemDoc = doc(db, 'actividades', draggedItemId);
    await updateDoc(itemDoc, { category: targetCat });
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <>
      <Navbar />
      <div className="lugares-container">
        <h2 className="projects-title">Lista de actividades para realizar en conjunto</h2>

        <div className="input-card">
          <input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Agregar nueva actividad"
          />
          <div className="input-group">
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="gratis">Gratuito</option>
              <option value="moderado">Precio moderado</option>
              <option value="caro">Costoso pero no imposible</option>
            </select>
            <button className="projects-buttom" onClick={addItem}>Agregar</button>
          </div>
        </div>

        <div className="categories">
          {['gratis', 'moderado', 'caro'].map((cat) => (
            <div
              key={cat}
              className="category"
              onDrop={(e) => handleDrop(e, cat)}
              onDragOver={allowDrop}
            >
              <h5>{
                cat === 'gratis'
                  ? 'Gratuito'
                  : cat === 'moderado'
                  ? 'Precio moderado'
                  : 'Costoso pero no imposible'
              }</h5>
              {/* 4. El renderizado ahora usa los datos del estado que alimenta Firebase */}
              {items[cat].map((i) => (
                <div
                  key={i.id}
                  className="item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, i.id)}
                >
                  <span>{i.text}</span>
                  <div>
                    <button onClick={() => editItem(i.id, i.text)}>✏️</button>
                    {/* El duplicado necesitaría su propia lógica con addDoc */}
                    <button onClick={() => deleteItem(i.id)}>❌</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}