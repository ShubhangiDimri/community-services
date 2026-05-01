import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Calendar, Ticket, User, Bell, Shield, LogOut,
  LayoutDashboard, Settings, Menu, X, MessageSquare
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🏛️</span>
          <span>WCH</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <Calendar size={16} /> Events
          </Link>

          {user && (
            <>
              <Link to="/app" className={`nav-link ${location.pathname === '/app' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/app/bookings" className={`nav-link ${isActive('/app/bookings') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <Ticket size={16} /> Bookings
              </Link>
              <Link to="/app/notifications" className={`nav-link ${isActive('/app/notifications') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <Bell size={16} /> Notifications
              </Link>
              <Link to="/app/forums" className={`nav-link ${isActive('/app/forums') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <MessageSquare size={16} /> Forums
              </Link>
              <Link to="/app/safety" className={`nav-link ${isActive('/app/safety') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <Shield size={16} /> Safety
              </Link>
              <Link to="/app/profile" className={`nav-link ${isActive('/app/profile') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <User size={16} /> Profile
              </Link>
              {isAdmin && (
                <Link to="/admin/events" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  <Settings size={16} /> Admin
                </Link>
              )}
              <button className="nav-logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary nav-cta" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
