import React from "react";
import "./LoveGame.css";

const LoveGame = () => {
  const gameUrl = "/JuegaAmor/index.html"; 

  return (
    <>
    <div className="juego-contenedor">
      <div>
        <p><a href="">Volver a proyecctos</a></p>
      </div>
      <iframe
        src={gameUrl}
        style={{ border: "none" }}
        title="Mini juego de Amor"
        tabIndex="0"
        className="game-iframe"
      />
      </div>
    </>
  );
};

export default LoveGame;