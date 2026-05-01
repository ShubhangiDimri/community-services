import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Ticket, CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';

const statusIcon = {
  PENDING: <Clock size={16} className="status-pending" />,
  CONFIRMED: <CheckCircle size={16} className="status-confirmed" />,
  CANCELLED: <XCircle size={16} className="status-cancelled" />,
};

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const payId = searchParams.get('pay');

  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['bookings', user?.userId],
    queryFn: () => bookingApi.get(`/bookings/user/${user?.userId}`).then(r => r.data),
    enabled: !!user,
  });

  const payMutation = useMutation({
    mutationFn: (bookingId) => bookingApi.post(`/bookings/pay/${bookingId}`).then(r => r.data),
    onSuccess: () => {
      toast.success('🎉 Payment successful! Booking confirmed!');
      queryClient.invalidateQueries(['bookings', user?.userId]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Payment failed'),
  });

  useEffect(() => {
    if (payId && bookings.find(b => b.id === payId && b.status === 'PENDING')) {
      payMutation.mutate(payId);
    }
  }, [payId, bookings]);

  if (isLoading) return <div className="page-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track all your event bookings and payments</p>
      </div>

      {isError && (
        <div className="empty-state error-state">
          <span>⚠️</span><p>Could not load bookings.</p>
        </div>
      )}

      {!isLoading && bookings.length === 0 && (
        <div className="empty-state">
          <Ticket size={48} />
          <p>No bookings yet. <a href="/events">Browse events</a> to get started!</p>
        </div>
      )}

      <div className="bookings-list">
        {bookings.map(b => (
          <div key={b.id} className={`booking-card status-border-${b.status?.toLowerCase()}`}>
            <div className="booking-card-header">
              <div className="booking-status">
                {statusIcon[b.status]}
                <span className={`status-text status-${b.status?.toLowerCase()}`}>{b.status}</span>
              </div>
              <span className="booking-amount">
                {Number(b.amount) === 0 ? 'Free' : `₹${b.amount}`}
              </span>
            </div>

            <div className="booking-card-body">
              <p><strong>Event ID:</strong> {b.eventId}</p>
              <p><strong>Tickets:</strong> {b.numberOfTickets}</p>
              <p><strong>Seat:</strong> {b.seatPreference}</p>
              <p><strong>Name:</strong> {b.fullName}</p>
            </div>

            {b.status === 'PENDING' && (
              <div className="booking-card-footer">
                <button
                  className="btn-primary"
                  onClick={() => payMutation.mutate(b.id)}
                  disabled={payMutation.isPending}
                >
                  <CreditCard size={16} />
                  {payMutation.isPending ? 'Processing…' : 'Pay Now'}
                </button>
              </div>
            )}

            {b.status === 'CONFIRMED' && (
              <div className="booking-receipt">
                ✅ Your booking is confirmed! Enjoy the event.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
