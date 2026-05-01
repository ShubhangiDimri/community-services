import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../lib/api';
import EventCard from '../components/EventCard';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.get('/events').then(r => r.data),
  });

  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

  const filtered = events.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || e.category === category;
    const matchOpen = !onlyOpen || e.bookingOpen;
    return matchSearch && matchCat && matchOpen;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Discover and book events at Women Community Hall</p>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search events"
          />
        </div>

        {categories.length > 0 && (
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        <label className="filter-check">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={e => setOnlyOpen(e.target.checked)}
          />
          Booking Open Only
        </label>
      </div>

      {isLoading && (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      )}

      {isError && (
        <div className="empty-state error-state">
          <span>⚠️</span>
          <p>Could not load events. Make sure the Event Service is running on port 8083.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="empty-state">
          <span>📅</span>
          <p>No events found. Try adjusting your filters.</p>
        </div>
      )}

      <div className="events-grid">
        {filtered.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
