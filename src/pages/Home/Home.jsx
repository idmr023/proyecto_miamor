import React from "react";
import "./Home.css";
import { Navbar } from "components/NavBar/NavBar";
import ContadoresDeAmor from '../../components/Countdown/components/CountDown';

export default function Home() {

  return (
    <div className="home-container">
      <Navbar/>

      <main className="main-content">
        <h1>Bienvenida a tu rincón amoroso <div className="heart">💗</div></h1>
        
        <div>
          <ContadoresDeAmor/>
        </div>
      </main>

      <footer className="footer">
        Hecho con amor por alguien que piensa en ti 💕
      </footer>
    </div>
  );
}
