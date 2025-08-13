import { Navbar } from 'components/NavBar/NavBar';
import './Regalitos.css';
import { BotonRedirec } from 'components/BotonRedireccionable/ButtonRedireccionable';

export default function Regalitos() {
  return (
    <>
    <Navbar/>
    <div className="projects-container">
      <h2 className="projects-title">Regalitos uwu</h2>
        <BotonRedirec 
          enlace={'/regalitos/cartita_conocernos'} 
          texto={'Cartita de amor'}
        />
        <BotonRedirec 
          enlace={'/regalitos/juega_amor'} 
          texto={'Juega por mi amor'}
        />
        <BotonRedirec 
          enlace={'/regalitos/lista'} 
          texto={'Lista de actividades'}
        />
        <BotonRedirec 
          enlace={'/regalitos/bitacora'} 
          texto={'Bitácora'}
        />
    </div>
    </>
  );
}