import React, { useState, useEffect } from "react";
import "./estilos.css"; 

// ====================================================================
// PIEZA REUTILIZABLE 1: El Hook con la lógica del contador
// ====================================================================
const useCountdown = (targetDate) => {
  const calculateTimeRemaining = () => {
    const eventTime = new Date(targetDate).getTime();
    const currentTime = new Date().getTime();
    const remaining = eventTime - currentTime;
    return remaining > 0 ? remaining : 0;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [targetDate]);

  return timeRemaining;
};

// ====================================================================
// PIEZA REUTILIZABLE 2: El componente que muestra el tiempo
// ====================================================================
const FormattedTimeDisplay = ({ time, endMessage }) => {
  if (time <= 0) {
    return <div className="countdown-final-message">{endMessage}</div>;
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

// ====================================================================
// CRONÓMETRO 1: El original, para verse
// ====================================================================
export const CountdownParaVernos = () => {
  const [targetDate] = useState(() => {
    const currentDate = new Date();
    let targetYear = currentDate.getFullYear();
    const eventDate = new Date(targetYear, 9, 2); // Mes 7 = Agosto, día 19

    if (currentDate > eventDate) {
      targetYear += 1;
    }
    return new Date(targetYear, 9, 2).toISOString();
  });

  const timeRemaining = useCountdown(targetDate);

  return (
    <div className="countdown-timer-container">
      <h2 className="countdown-name">Cantidad de tiempo restante para vernos:</h2>
      <FormattedTimeDisplay time={timeRemaining} endMessage="¡Es hoy! 🥰" />
    </div>
  );
};

// ====================================================================
// CRONÓMETRO 2: El nuevo, para ser enamorados
// ====================================================================
export const CountdownEnamorados = () => {
  const [targetDate] = useState('2026-01-09T00:00:00'); // La fecha que calculamos

  const timeRemaining = useCountdown(targetDate);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="countdown-timer-container">
      <h2 className="countdown-name">Tiempo restante para ser enamorados:</h2>
      <p className="countdown-target-date">{formatDate(targetDate)}</p>
      <FormattedTimeDisplay time={timeRemaining} endMessage="¡Nuestro tiempo ha llegado! ❤️" />
    </div>
  );
};

// ====================================================================
// COMPONENTE PRINCIPAL: Exporta ambos contadores para usarlos juntos
// ====================================================================
const ContadoresDeAmor = () => {
  return (
    <div>
      <CountdownParaVernos />
      <CountdownEnamorados />
    </div>
  );
};

export default ContadoresDeAmor;
