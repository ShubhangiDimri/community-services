import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Tag, IndianRupee, ArrowLeft } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.get(`/events/${id}`).then(r => r.data),
  });

  if (isLoading) return <div className="page-container"><div className="loader" /></div>;
  if (isError || !event) return (
    <div className="page-container">
      <div className="empty-state error-state">
        <span>⚠️</span><p>Event not found.</p>
        <button className="btn-outline" onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    </div>
  );

  const isFree = event.free || event.isFree;

  return (
    <div className="page-container detail-page">
      <button className="btn-ghost back-btn" onClick={() => navigate('/events')}>
        <ArrowLeft size={16} /> All Events
      </button>

      <div className="detail-card">
        <div className="detail-badges">
          <span className={`badge ${isFree ? 'badge-success' : 'badge-info'}`}>
            {isFree ? 'Free Entry' : `Base Price ₹${event.basePrice}`}
          </span>
          <span className={`badge ${event.bookingOpen ? 'badge-success' : 'badge-muted'}`}>
            {event.bookingOpen ? '🟢 Booking Open' : '🔴 Booking Closed'}
          </span>
          {event.category && <span className="badge badge-purple">{event.category}</span>}
        </div>

        <h1 className="detail-title">{event.title}</h1>
        <p className="detail-desc">{event.description}</p>

        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <Calendar size={20} />
            <div><label>Date</label><span>{event.date}</span></div>
          </div>
          <div className="detail-meta-item">
            <Clock size={20} />
            <div><label>Time</label><span>{event.time}</span></div>
          </div>
          <div className="detail-meta-item">
            <MapPin size={20} />
            <div><label>Location</label><span>{event.location}</span></div>
          </div>
          {!isFree && (
            <div className="detail-meta-item">
              <IndianRupee size={20} />
              <div>
                <label>Pricing</label>
                <span>Base: ₹{event.basePrice}</span>
                {event.frontSurcharge && <span>Front Surcharge: +₹{event.frontSurcharge}</span>}
                {event.middleSurcharge && <span>Middle Surcharge: +₹{event.middleSurcharge}</span>}
              </div>
            </div>
          )}
        </div>

        <div className="detail-actions">
          {event.bookingOpen ? (
            user ? (
              <Link to={`/events/${id}/book`} className="btn-primary large">Book Tickets</Link>
            ) : (
              <Link to="/login" className="btn-primary large">Login to Book</Link>
            )
          ) : (
            <button className="btn-primary large" disabled>Booking Unavailable</button>
          )}
        </div>
      </div>
    </div>
  );
}
