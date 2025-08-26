import React, { useEffect, useState } from 'react';

export default function LoadingModal({ onFinished }) {
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeout(true);
    }, 3000); // Duración del fade-in

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 4000); // Duración total + fade-out

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

return (
    <div className={fadeout ? 'loading-modal fade-out' : 'loading-modal'}>
      <h1>Teletransportando al universo M! AM4R...</h1>
    </div>
  );
}