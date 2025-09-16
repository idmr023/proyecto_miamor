import { Navbar } from 'components/NavBar/NavBar';
import './Regalitos.css';
import { BotonRedirec } from 'components/BotonRedireccionable/ButtonRedireccionable';
import { rutasRegalitos } from 'App';

export default function Regalitos() {
  return (
    <>
      <Navbar/>
      <div className="projects-container">
        {rutasRegalitos.map(ruta => (
            <BotonRedirec 
              key={ruta.path}
              enlace={ruta.path} 
              texto={ruta.name}
            />
          ))}
      </div>
    </>
  );
}