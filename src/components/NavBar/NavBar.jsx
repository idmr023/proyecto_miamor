import "./NavBar.css"

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">Tu Rincón 💗</div>
      <div className="nav-links">
        <a href="/projects">Proyectos</a>
        <a href="/tools">Cosas Útiles</a>
      </div>
    </nav>
  );
}