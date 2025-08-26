import React, { useRef } from 'react'; // 1. Importamos 'useRef'
import Draggable from 'react-draggable';

export default function Planeta({ nombre, tamaño, isSelected, onClick, defaultPosition }) {
  // Genera un color aleatorio para el planeta basado en su nombre
  const hashCode = s => s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0)
  const color = `hsl(${hashCode(nombre) % 360}, 60%, 70%)`;

  // 2. Creamos una ref que apuntará a nuestro div principal.
  const nodeRef = useRef(null);

  return (
    // 3. Le pasamos la ref al componente Draggable a través del prop 'nodeRef'
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition}>
      {/* 4. Adjuntamos la ref al div que queremos que sea arrastrable */}
      <div
        ref={nodeRef} 
        className="planeta-draggable"
        onClick={onClick}
      >
        <div
          style={{
            width: `${tamaño}px`,
            height: `${tamaño}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${tamaño / 4}px ${color}`,
          }}
          className={`planeta__circulo ${isSelected ? 'planeta__circulo--selected' : ''}`}
        ></div>
        <span className="planeta__nombre">{nombre}</span>
      </div>
    </Draggable>
  );
}