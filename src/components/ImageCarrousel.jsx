import React, { useState, useEffect } from 'react';

// Este componente recibe un array de URLs de imágenes
export default function ImageCarousel({ images }) {
  // Estado para saber qué imagen estamos mostrando (su índice)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para resetear el carrusel a la primera imagen
  // cada vez que el recuerdo principal cambie.
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const goToPrevious = () => {
    // Si estamos en la primera imagen, vamos a la última. Si no, retrocedemos una.
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    // Si estamos en la última imagen, vamos a la primera. Si no, avanzamos una.
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Si no hay imágenes, no mostramos nada.
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      {/* Botón para ir a la imagen anterior (solo si hay más de una foto) */}
      {images.length > 1 && (
        <button onClick={goToPrevious} className="carousel-button prev">
          &#10094;
        </button>
      )}

      {/* La imagen que se está mostrando actualmente */}
      <img
        src={images[currentIndex]}
        alt={`Recuerdo ${currentIndex + 1}`}
        className="sidebar-image" // Reutilizamos la clase que ya tienes
      />

      {/* Botón para ir a la siguiente imagen (solo si hay más de una foto) */}
      {images.length > 1 && (
        <button onClick={goToNext} className="carousel-button next">
          &#10095;
        </button>
      )}

      {/* Contador de imágenes (ej. "2 / 5") */}
      {images.length > 1 && (
        <div className="carousel-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}