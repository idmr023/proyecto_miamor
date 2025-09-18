
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Home from './pages/Home/Home';
import HeartLoader from 'components/HeartLoader/HeartLoader';
import Regalitos from 'pages/Regalitos/Regalitos';
import Actividades from 'pages/Regalitos/ListaActividades/Actividades';
import ListaRegalos from 'pages/Regalitos/ListaRegalos/ListaRegalos';
import Mapa from 'pages/Regalitos/Bitácora/MapaAventuras';
import Carta from 'pages/Regalitos/CartitaAmor/Carta';
import LoveGame from 'pages/Regalitos/JuegaAmor/LoveGame';
import MetasUniverso from 'pages/Regalitos/MetasUniverso/MetasUniverso';
import BooChatConversation from 'pages/Regalitos/BooChat/BooChatConversation';

export const rutasRegalitos = [
  { path: "/regalitos/cartita_conocernos", element: <Carta />, name: 'Cartita de amor'},
  { path: "/regalitos/juega_amor", element: <LoveGame />, name: 'Juega por mi amor'},
  { path: "/regalitos/lista", element: <Actividades />, name: 'Lista de actividades'},
  { path: "/regalitos/lista_regalos", element: <ListaRegalos />, name: 'Lista de regalitos'},
  { path: "/regalitos/bitacora", element: <Mapa />, name: 'Bitácora' },
  { path: "/regalitos/metas", element: <MetasUniverso />, name: 'Nuestras metas'},
  { path: "/regalitos/chat", element: <BooChatConversation />, name: 'Chat de Boo, donde todo inició'}
]

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <HeartLoader /> },
    { path: "/home", element: <Home /> },
    { path: "/regalitos", element: <Regalitos /> },
    { path: "/regalitos/lista_regalos", element: <ListaRegalos /> },
    ...rutasRegalitos
  ]);

  return routes;
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}