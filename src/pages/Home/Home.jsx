import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import VoiceAuth from "components/VoiceAuth";
import { Navbar } from "components/NavBar/NavBar";
import CountdownTimer from "./Countdown/components/CountDown";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar/>

      <main className="main-content">
        <h1>Bienvenida a tu rincón amoroso <div className="heart">💗</div></h1>
        
        <div>
          <CountdownTimer/>
        </div>
      </main>

      <footer className="footer">
        Hecho con amor por alguien que piensa en ti 💕
      </footer>
    </div>
  );
}