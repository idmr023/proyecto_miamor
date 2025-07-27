import { Navbar } from 'components/NavBar/NavBar';
import './Projects.css';

export default function Projects() {
  return (
    <>

      <Navbar/>
    <div className="projects-container">
      <h2 className="projects-title">Regalitos uwu</h2>
      <ul className="projects-list">
        <a href='/projects/cartita_conocernos'><li className="project-item">Cartita de amor</li></a>
        <a href='/projects/juega_amor'><li className="project-item">Juega por mi amor</li></a>
      </ul>
    </div>
    </>
  );
}