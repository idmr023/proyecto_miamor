import React, { useState, useEffect } from 'react'; // 1. Importamos useEffect
import './Actividades.css';
import { Navbar } from 'components/NavBar/NavBar';

// 2. Definimos una clave para guardar los datos en localStorage
const LOCAL_STORAGE_KEY = 'lista-de-actividades';

export default function Actividades() {
  const [lugar, setLugar] = useState('');
  const [categoria, setCategoria] = useState('gratis');

  // 3. INICIALIZACIÓN DEL ESTADO: Leemos desde localStorage al cargar
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedItems) {
      return JSON.parse(savedItems); // Si hay datos guardados, los usamos
    } else {
      return { gratis: [], moderado: [], caro: [] }; // Si no, empezamos de cero
    }
  });

  // El contador de IDs también debe ser inteligente para no repetirse
  const [idCounter, setIdCounter] = useState(() => {
    const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      // Buscamos el ID numérico más alto y empezamos desde ahí
      const allIds = Object.values(parsedItems).flat().map(item => parseInt(item.id.split('-')[1]));
      return allIds.length > 0 ? Math.max(...allIds) + 1 : 0;
    }
    return 0;
  });

  // 4. GUARDADO AUTOMÁTICO: Este efecto se ejecuta cada vez que 'items' cambia
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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
    const itemToEdit = items[cat].find(i => i.id === id);
    const nuevo = prompt('Editar lugar:', itemToEdit?.text);
    if (nuevo === null || nuevo.trim() === '') return;
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
    if (!original) return;
    const newId = `item-${idCounter}`;
    const newItem = { id: newId, text: original.text };
    setItems({
      ...items,
      [cat]: [...items[cat], newItem],
    });
    setIdCounter(idCounter + 1);
  };

  const handleDragStart = (e, id, cat) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id, cat }));
  };

  // 5. FUNCIÓN DE DROP CORREGIDA para mover en lugar de copiar
  const handleDrop = (e, targetCat) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const { id: draggedItemId, cat: sourceCat } = data;

    if (sourceCat === targetCat) return;

    const itemToMove = items[sourceCat]?.find(i => i.id === draggedItemId);
    if (!itemToMove) return;

    setItems(currentItems => {
      const newSourceItems = currentItems[sourceCat].filter(i => i.id !== draggedItemId);
      const newTargetItems = [...currentItems[targetCat], itemToMove];
      return {
        ...currentItems,
        [sourceCat]: newSourceItems,
        [targetCat]: newTargetItems,
      };
    });
  };

  const allowDrop = e => e.preventDefault();

  return (
    <>
      <Navbar />
      <div className="lugares-container">
        <h2 className="projects-title">Lista de actividades para realizar en conjunto</h2>

        <div className="input-card">
          <input
            type="text"
            value={lugar}
            onChange={e => setLugar(e.target.value)}
            placeholder="Agregar nueva actividad"
          />
          <div className="input-group">
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="gratis">Gratuito</option>
              <option value="moderado">Precio moderado</option>
              <option value="caro">Costoso pero no imposible</option>
            </select>
            <button className="projects-buttom" onClick={addItem}>Agregar</button>
          </div>
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
              {items[cat] && items[cat].map(i => (
                <div
                  key={i.id}
                  className="item"
                  draggable
                  onDragStart={e => handleDragStart(e, i.id, cat)}
                >
                  <span>{i.text}</span>
                  <div>
                    <button onClick={() => editItem(cat, i.id)}>✏️</button>
                    <button onClick={() => duplicateItem(cat, i.id)}>📋</button>
                    <button onClick={() => deleteItem(cat, i.id)}>❌</button>
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