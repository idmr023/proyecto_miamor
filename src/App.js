// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import HeartLoader from 'components/HeartLoader/HeartLoader';
import Tools from './pages/Herramientas/Tools';
import Projects from './pages/Projects/Projects';
import LoveGame from './pages/Projects/JuegaAmor/LoveGame';
import Carta from './pages/Projects/CartitaAmor/Carta';
import Actividades from 'pages/Herramientas/ListaActividades/Actividades';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeartLoader />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/lista" element={<Actividades />} />
        <Route path="/projects/cartita_conocernos" element={<Carta/>} />
        <Route path="/projects/juega_amor" element={<LoveGame/>} />
      </Routes>
    </Router>
  );
}
