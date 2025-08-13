import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import HeartLoader from 'components/HeartLoader/HeartLoader';
import Regalitos from 'pages/Regalitos/Regalitos';
import Actividades from 'pages/Regalitos/ListaActividades/Actividades';
import Mapa from 'pages/Regalitos/Bitácora/MapaAventuras';
import Carta from 'pages/Regalitos/CartitaAmor/Carta';
import LoveGame from 'pages/Regalitos/JuegaAmor/LoveGame';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeartLoader />} />
        <Route path="/home" element={<Home />} />
        <Route path="/regalitos" element={<Regalitos />} />
        <Route path="/regalitos/lista" element={<Actividades />} />
        <Route path="/regalitos/bitacora" element={<Mapa/>} />
        <Route path="/regalitos/cartita_conocernos" element={<Carta/>} />
        <Route path="/regalitos/juega_amor" element={<LoveGame/>} />
      </Routes>
    </Router>
  );
}
