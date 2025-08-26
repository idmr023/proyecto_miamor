import React from 'react';
import Planeta from './Planeta';
import { calcularTamañoMundo } from '../utils/goalUtils';

export default function UniversoCanvas({ mundos, onSelectMundo, selectedMundo }) {
  return (
    <div className="universo-canvas">
      <div className="universo-canvas__sol">
        <div className="universo-canvas__sol-circulo"></div>
        <span className="universo-canvas__objeto-nombre">El Sol de Nuestros Inicios</span>
      </div>

      {/* Renderiza cada planeta */}
      {Object.values(mundos).map((mundo, index) => {
        // Evitamos renderizar el agujero negro aquí
        if (mundo.nombre === 'agujero-negro') return null;

        const tamaño = calcularTamañoMundo(mundo.puntosDificultad);
        // Posicionamiento simple para evitar que se solapen al inicio
        const top = `${20 + (index % 3) * 30}%`;
        const left = `${35 + index * 10}%`;

        return (
          <Planeta
            key={mundo.nombre}
            nombre={`A4IO-${mundo.nombre}`}
            tamaño={tamaño}
            isSelected={selectedMundo === mundo.nombre}
            onClick={() => onSelectMundo(mundo.nombre)}
            defaultPosition={{ x: window.innerWidth * (0.3 + (index * 0.1)), y: window.innerHeight * (0.2 + ((index % 3) * 0.3)) }}
          />
        );
      })}

      <div className="universo-canvas__agujero-negro" onClick={() => onSelectMundo('agujero-negro')}>
        <div className={`universo-canvas__agujero-negro-circulo ${selectedMundo === 'agujero-negro' ? 'universo-canvas__agujero-negro-circulo--selected' : ''}`}></div>
        <span className="universo-canvas__objeto-nombre">Metas sin Fecha</span>
      </div>
    </div>
  );
}