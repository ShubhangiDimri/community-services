import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, Shield, Bell, User, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const cards = [
    { icon: <Calendar size={32} />, label: 'Browse Events', to: '/events', color: 'card-blue' },
    { icon: <Ticket size={32} />, label: 'My Bookings', to: '/app/bookings', color: 'card-purple' },
    { icon: <Shield size={32} />, label: 'Safety & SOS', to: '/app/safety', color: 'card-red' },
    { icon: <Bell size={32} />, label: 'Notifications', to: '/app/notifications', color: 'card-amber' },
    { icon: <User size={32} />, label: 'My Profile', to: '/app/profile', color: 'card-teal' },
  ];

  if (isAdmin) {
    cards.push({ icon: <LayoutDashboard size={32} />, label: 'Admin Panel', to: '/admin/events', color: 'card-pink' });
  }

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Women Community Hall — Your community, your space.</p>
        {isAdmin && <span className="badge badge-purple">Admin</span>}
      </div>

      <div className="dashboard-grid">
        {cards.map(c => (
          <Link to={c.to} key={c.to} className={`dash-card ${c.color}`}>
            <div className="dash-card-icon">{c.icon}</div>
            <span>{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
