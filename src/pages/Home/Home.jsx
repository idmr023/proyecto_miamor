import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import VoiceAuth from "components/VoiceAuth";
import { Navbar } from "components/NavBar/NavBar";

export default function Home() {
  const [message, setMessage] = useState("Inicia sesión para continuar 💖");
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar/>

      <main className="main-content">
        <h1>Bienvenida a tu rincón amoroso 💌</h1>
        <div className="heart">💗</div>
      </main>

      <footer className="footer">
        Hecho con amor por alguien que piensa en ti 💕
      </footer>
    </div>
  );
}