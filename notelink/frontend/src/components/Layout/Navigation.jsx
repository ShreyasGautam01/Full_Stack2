import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`nav-link${location.pathname === to ? ' nav-link-active' : ''}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">NoteLink</Link>

      {user ? (
        <div className="nav-actions">
          {navLink('/', 'Notes')}
          {navLink('/graph', 'Graph')}
          <span className="nav-divider" />
          <span className="nav-username">{user.username}</span>
          <Link to="/notes/new" className="btn btn-primary btn-sm">+ New note</Link>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">Sign out</button>
        </div>
      ) : (
        <div className="nav-actions">
          <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
        </div>
      )}
    </nav>
  );
}