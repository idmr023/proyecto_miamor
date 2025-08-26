// src/pages/MetasUniverso/components/MetaForm.jsx

import React, { useState } from 'react';

export default function MetaForm({ onSave, onCancel, añoSeleccionado, todasLasMetas }) {
  // Estado para cada campo del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [propietario, setPropietario] = useState('ambos');
  const [dificultad, setDificultad] = useState('intermedia');
  const [preRequisitos, setPreRequisitos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    const nuevaMeta = {
      titulo,
      descripcion,
      año: añoSeleccionado === 'agujero-negro' ? 0 : parseInt(añoSeleccionado),
      propietario,
      dificultad,
      preRequisitos,
      estado: 'pendiente',
      fecha: new Date(), // Usamos la fecha actual al crear
    };

    onSave(nuevaMeta);
  };

  return (
    <form onSubmit={handleSubmit} className="meta-form">
      <h3>Añadir Nueva Meta en {añoSeleccionado === 'agujero-negro' ? 'Metas sin Fecha' : `A4IO-${añoSeleccionado}`}</h3>

      <div className="form-group">
        <label htmlFor="titulo">Título de la Meta</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Comprar nuestro departamento"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="3"
        />
      </div>

      <div className="form-group-inline">
        <div className="form-group">
          <label htmlFor="propietario">Propietario</label>
          <select id="propietario" value={propietario} onChange={(e) => setPropietario(e.target.value)}>
            <option value="ambos">Ambos</option>
            <option value="ivan">Iván</option>
            <option value="antok">Antok</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dificultad">Dificultad</label>
          <select id="dificultad" value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
            <option value="facil">Fácil</option>
            <option value="intermedia">Intermedia</option>
            <option value="dificil">Difícil</option>
            <option value="muy_dificil">Muy Difícil</option>
          </select>
        </div>
      </div>
      
      {/* TODO: Lógica para el selector de pre-requisitos */}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
        <button type="submit" className="btn-save">
          Guardar Meta
        </button>
      </div>
    </form>
  );
}