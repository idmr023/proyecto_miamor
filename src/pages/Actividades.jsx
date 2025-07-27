// src/pages/Actividades.jsx

import React, { useState } from 'react';
import './Actividades.css';

export default function Lugares() {
  const [lugar, setLugar] = useState('');
  const [categoria, setCategoria] = useState('gratis');
  const [items, setItems] = useState({ gratis: [], moderado: [], caro: [] });
  const [idCounter, setIdCounter] = useState(0);

  const addItem = () => {
    if (!lugar.trim()) return;
    const newItem = { id: `item-${idCounter}`, text: lugar };
    setItems({
      ...items,
      [categoria]: [...items[categoria], newItem],
    });
    setLugar('');
    setIdCounter(idCounter + 1);
  };

  const editItem = (cat, id) => {
    const nuevo = prompt('Editar lugar:', items[cat].find(i => i.id === id)?.text);
    if (!nuevo) return;
    setItems({
      ...items,
      [cat]: items[cat].map(i => (i.id === id ? { ...i, text: nuevo } : i)),
    });
  };

  const deleteItem = (cat, id) => {
    setItems({
      ...items,
      [cat]: items[cat].filter(i => i.id !== id),
    });
  };

  const duplicateItem = (cat, id) => {
    const original = items[cat].find(i => i.id === id);
    const newId = `item-${idCounter}`;
    const newItem = { id: newId, text: original.text };
    setItems({
      ...items,
      [cat]: [...items[cat], newItem],
    });
    setIdCounter(idCounter + 1);
  };

  const handleDragStart = (e, id, cat) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, cat }));
  };

  const handleDrop = (e, targetCat) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const draggedItem = items[data.cat].find(i => i.id === data.id);
    if (!draggedItem) return;
    deleteItem(data.cat, data.id);
    setItems({
      ...items,
      [targetCat]: [...items[targetCat], draggedItem],
    });
  };

  const allowDrop = e => e.preventDefault();

  return (
    <div className="lugares-container">
      <h1>Proyectos para Mi Pareja</h1>
      <div className="project-card">
        <h2>Lugares para visitar juntos</h2>
        <input
          type="text"
          value={lugar}
          onChange={e => setLugar(e.target.value)}
          placeholder="Agregar nuevo lugar"
        />
        <div className="input-group">
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="gratis">Gratuito</option>
            <option value="moderado">Precio moderado</option>
            <option value="caro">Costoso pero no imposible</option>
          </select>
          <button onClick={addItem}>Agregar</button>
        </div>
        <div className="categories">
          {['gratis', 'moderado', 'caro'].map(cat => (
            <div
              key={cat}
              className="category"
              onDrop={e => handleDrop(e, cat)}
              onDragOver={allowDrop}
            >
              <h5>{
                cat === 'gratis'
                  ? 'Gratuito'
                  : cat === 'moderado'
                  ? 'Precio moderado'
                  : 'Costoso pero no imposible'
              }</h5>
              {items[cat].map(i => (
                <div
                  key={i.id}
                  className="item"
                  draggable
                  onDragStart={e => handleDragStart(e, i.id, cat)}
                >
                  <span>{i.text}</span>
                  <button onClick={() => editItem(cat, i.id)}>✏️</button>
                  <button onClick={() => duplicateItem(cat, i.id)}>📋</button>
                  <button onClick={() => deleteItem(cat, i.id)}>❌</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
