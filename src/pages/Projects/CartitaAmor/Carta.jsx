import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Carta.css';
import { Navbar } from 'components/NavBar/NavBar';

const textos = [
  `También te quería comentar que mi meta del año es terminar con la carrera, de ahí hacer un diplomado y si Dios quiere y no exploto titularme a la vez...`,
  `Te quería mencionar esto, siendo honesto, porque me estás empezando a gustar, no puedo dejar de pensar en ti...`,
  `Por mencionar, ahorita mismo estoy con el gym, la u, la tesis, el trabajo, ahora hablando contigo...`
];

export default function Carta() {
  const [textoActual, setTextoActual] = useState(['', '', '']);
  const noBtnRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const speed = 60;

    const escribirTexto = (texto, index, callback) => {
      let i = 0;
      const escribir = () => {
        if (i < texto.length) {
          setTextoActual((prev) => {
            const nuevo = [...prev];
            // Se corrige la forma de actualizar el texto para evitar duplicados
            nuevo[index] = texto.slice(0, i + 1);
            return nuevo;
          });
          i++;
          setTimeout(escribir, speed);
        } else if (callback) {
          callback();
        }
      };
      escribir();
    };

    escribirTexto(textos[0], 0, () => {
      escribirTexto(textos[1], 1, () => {
        escribirTexto(textos[2], 2);
      });
    });
  }, []);

  const handleSi = () => {
    fetch(`/api/respuesta?tipo=si&t=${Date.now()}`);
    alert('¡Gracias por responder! 💌');
  };

  const handleNo = () => {
    fetch(`/api/respuesta?tipo=no&t=${Date.now()}`);
    alert('¡Gracias por tu sinceridad! 🥲');
  };

  const moverBotonNo = () => {
    const btn = noBtnRef.current;
    const cont = containerRef.current;
    if (btn && cont) {
      const maxX = cont.clientWidth - btn.offsetWidth;
      const maxY = cont.clientHeight - btn.offsetHeight;
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      btn.style.left = `${x}px`;
      btn.style.top = `${y}px`;
    }
  };

  return (
    <>
    <div className='carta-contenedor'>
    <div>
      <p><a href="/projects">Volver a proyecctos</a></p>
    </div>

      <div className="carta">
        <h1>Hola, señorita con una linda voz</h1>
        <p className="texto-escrito">{textoActual[0]}</p>
        <p className="texto-escrito">{textoActual[1]}</p>
        <p className="texto-escrito">{textoActual[2]}</p>

        <h5 className="mt-4">¿Te sumas a esta aventura?</h5>
        <div className="respuestas" ref={containerRef}>
          <button className="btn btn-success btn-si me-2" onClick={handleSi}>
            Sí 💖
          </button>
          <button
            className="btn btn-outline-danger btn-no"
            ref={noBtnRef}
            onMouseEnter={moverBotonNo}
            onClick={handleNo}
          >
            No 😢
          </button>
        </div>
      </div>
      </div>
    </>
  );
}