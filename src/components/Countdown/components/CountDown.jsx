import React, { useState, useEffect } from "react";
import "./estilos.css"; 

const CountdownTimer = () => {
  // 1. La fecha objetivo sigue siendo una constante fija.
  const [targetDate] = useState(() => {
    const currentDate = new Date();
    let targetYear = currentDate.getFullYear();
    const augustFirst = new Date(targetYear, 7, 19); // El mes 7 es agosto (en JS los meses van de 0 a 11)

    if (currentDate > augustFirst) {
      targetYear += 1;
    }
    return new Date(targetYear, 7, 19).toISOString();
  });
  
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
      }

      setTimeRemaining(remainingTime);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [targetDate]);

  const formatTime = (time) => {
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