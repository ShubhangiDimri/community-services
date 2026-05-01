import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../lib/api';

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: () => bookingApi.get('/bookings').then(r => r.data),
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Bookings</h1>
        <span className="badge badge-info">{bookings.length} total</span>
      </div>

      {isLoading && <div className="loader" />}

      {isError && (
        <div className="empty-state error-state">
          <span>⚠️</span><p>Could not load bookings.</p>
        </div>
      )}

      <div className="admin-events-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Event ID</th>
              <th>Tickets</th>
              <th>Seat</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td><code>{b.id?.slice(0, 8)}…</code></td>
                <td>{b.fullName}<br /><small>{b.email}</small></td>
                <td><code>{b.eventId?.slice(0, 8)}…</code></td>
                <td>{b.numberOfTickets}</td>
                <td>{b.seatPreference}</td>
                <td>{Number(b.amount) === 0 ? 'Free' : `₹${b.amount}`}</td>
                <td>
                  <span className={`badge badge-${b.status?.toLowerCase() === 'confirmed' ? 'success' : b.status?.toLowerCase() === 'cancelled' ? 'error' : 'muted'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && !isLoading && (
          <div className="empty-state"><p>No bookings in the system yet.</p></div>
        )}
      </div>
    </div>
  );
}
