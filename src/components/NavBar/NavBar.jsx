import "./NavBar.css"

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo"><a href="/home">Tu Rincón 💗</a></div>
      <div className="nav-links">
        <a href="/regalitos">Regalitos</a>
      </div>
    </nav>
  );
}