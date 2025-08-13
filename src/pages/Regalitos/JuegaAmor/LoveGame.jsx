import React from "react";
import "./LoveGame.css";
import { BotonRedirec } from "components/BotonRedireccionable/ButtonRedireccionable";
import { Navbar } from "components/NavBar/NavBar";

const LoveGame = () => {
  const gameUrl = "/JuegaAmor/index.html"; 

  return (
    <>
    <Navbar/>
    <div className="juego-contenedor">
      <iframe
        src={gameUrl}
        style={{ border: "none" }}
        title="Mini juego de Amor"
        tabIndex="0"
        className="game-iframe"
      />
          <BotonRedirec
            enlace={'/regalitos'} 
            texto={'Regresar'}
            />
      </div>
    </>
  );
};

export default LoveGame;