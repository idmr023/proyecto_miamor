import './BotonRedireccionable.css'
import { Link } from 'react-router-dom';

export function BotonRedirec({ enlace, texto }) {
  return (
    <Link
      to={enlace}
      className="boton-redirec"
    >
      {texto}
    </Link>
  );
}