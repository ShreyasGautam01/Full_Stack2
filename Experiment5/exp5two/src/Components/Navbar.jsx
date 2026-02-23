import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/about">Profile</Link>
    </nav>
  );
}