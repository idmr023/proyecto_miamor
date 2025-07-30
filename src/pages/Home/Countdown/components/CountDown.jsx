import React, { useState, useEffect } from "react";
import "./estilos.css"; 

const CountdownTimer = () => {
  // 1. La fecha objetivo sigue siendo una constante fija.
  const [targetDate] = useState(() => {
    const currentDate = new Date();
    let targetYear = currentDate.getFullYear();
    const augustFirst = new Date(targetYear, 7, 1); // El mes 7 es agosto (en JS los meses van de 0 a 11)

    // Si la fecha de este año ya pasó, calcula para el próximo año.
    if (currentDate > augustFirst) {
      targetYear += 1;
    }
    return new Date(targetYear, 7, 1).toISOString();
  });
  
  // 2. Se calcula el tiempo restante inicial para evitar que se muestre 0 al principio.
  const calculateInitialTime = () => {
    const eventTime = new Date(targetDate).getTime();
    const currentTime = new Date().getTime();
    const remaining = eventTime - currentTime;
    return remaining > 0 ? remaining : 0;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateInitialTime);

  // 3. Este efecto se ejecuta una sola vez y activa el contador automáticamente.
  useEffect(() => {

    const countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const eventTime = new Date(targetDate).getTime();
      let remainingTime = eventTime - currentTime;

      if (remainingTime <= 0) {
        remainingTime = 0;
        clearInterval(countdownInterval);
        // El alert fue removido para una mejor experiencia de usuario.
      }

      setTimeRemaining(remainingTime);
    }, 1000);

    // Se limpia el intervalo cuando el componente se desmonta para evitar fugas de memoria.
    return () => clearInterval(countdownInterval);
  }, [targetDate]); // El efecto depende de targetDate, que no cambia.

  const formatTime = (time) => {
    // Si el tiempo se acabó, muestra un mensaje especial.
    if (time <= 0) {
      return <div className="countdown-display">¡Es hoy! 🥰</div>;
    }
    
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return (
      <div className="countdown-display">
        <div className="countdown-value">
          {days.toString().padStart(2, "0")} <span>días</span>
        </div>
        <div className="countdown-value">
          {hours.toString().padStart(2, "0")} <span> horas</span>
        </div>
        <div className="countdown-value">
          {minutes.toString().padStart(2, "0")} <span>minutos</span>
        </div>
        <div className="countdown-value">
          {seconds.toString().padStart(2, "0")} <span>segundos</span>
        </div>
      </div>
    );
  };
  
  // Función para mostrar la fecha objetivo de forma legible.
  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="countdown-timer-container">
      <h2 className="countdown-name">
        Cantidad de tiempo restante para vernos:
      </h2>

      {formatTime(timeRemaining)}
    </div>
  );
};

export default CountdownTimer;