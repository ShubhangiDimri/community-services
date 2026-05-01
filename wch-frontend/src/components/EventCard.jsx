import { Calendar, MapPin, Tag, IndianRupee, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const isFree = event.free || event.isFree;
  // Use a fallback image based on category or default
  const fallbackImages = {
    workshop: 'https://www.aib.world/wp-content/uploads/2022/02/sustainability-professional-development-workshop.jpg',
    health: 'https://www.niehs.nih.gov/sites/default/files/health/assets/images/img895569.jpg',
    cultural: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuBkD6hR_DEmseW3JfNkQIW-7ZFaj3-KWgoQ&s',
    seminar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQilAtxyLepQtkFA6AsXN7uXYrqDoJRt9NgpQ&s'
  };
  const imgUrl = event.imageUrl || fallbackImages[event.category?.toLowerCase()] || fallbackImages.workshop;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <img src={imgUrl} alt={event.title} />
      </div>

      <div className="event-card-body">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className={`badge ${isFree ? 'badge-success' : 'badge-info'}`}>
            {isFree ? 'Free' : `₹${event.basePrice}`}
          </span>
          <span className={`badge ${event.bookingOpen ? 'badge-success' : 'badge-muted'}`}>
            {event.bookingOpen ? 'Booking Open' : 'Booking Closed'}
          </span>
        </div>

        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        <div className="event-card-meta">
          <span><Calendar size={14} />{event.date}</span>
          <span><Clock size={14} />{event.time}</span>
          <span><MapPin size={14} />{event.location}</span>
          {event.category && <span><Tag size={14} />{event.category}</span>}
        </div>
      </div>

      <div className="event-card-footer">
        <Link to={`/events/${event.id}`} className="btn-outline">View Details</Link>
        {event.bookingOpen && (
          <Link to={`/events/${event.id}/book`} className="btn-primary">Book Now</Link>
        )}
      </div>
    </div>
  );
}
