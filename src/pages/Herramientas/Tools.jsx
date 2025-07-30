import { Navbar } from 'components/NavBar/NavBar';
import './Tools.css';

export default function Tools() {
  return (
    <>
    <Navbar/>
    <div className="projects-container">
      <h2 className="projects-title">Herramientas y cositas útiles</h2>
      <ul className="projects-list">
        <a href='/tools/lista'><li className="project-item">Lista de lugares para visitar y actividades a realizar</li></a>
      </ul>
    </div>
    </>
  );
}