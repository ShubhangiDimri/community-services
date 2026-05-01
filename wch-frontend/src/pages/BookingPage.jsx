import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { eventApi, bookingApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const schema = z.object({
  numberOfTickets: z.coerce.number().min(1, 'At least 1 ticket required'),
  seatPreference: z.string().min(1, 'Select a preference'),
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().min(10, 'Valid phone required'),
});

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.get(`/events/${id}`).then(r => r.data),
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.name || '',
      phone: '',
      numberOfTickets: 1,
      seatPreference: 'ANY',
    },
  });

  const tickets = watch('numberOfTickets');
  const seat = watch('seatPreference');

  useEffect(() => {
    if (!event) return;
    const isFree = event.free || event.isFree;
    if (isFree) { setEstimate(0); return; }
    let base = Number(event.basePrice) || 0;
    if (seat?.toUpperCase().includes('FRONT') && event.frontSurcharge) base += Number(event.frontSurcharge);
    else if (seat?.toUpperCase().includes('MIDDLE') && event.middleSurcharge) base += Number(event.middleSurcharge);
    setEstimate(base * Number(tickets || 1));
  }, [tickets, seat, event]);

  const mutation = useMutation({
    mutationFn: (payload) => bookingApi.post('/bookings', payload).then(r => r.data),
    onSuccess: (booking) => {
      toast.success('Booking created! Proceeding to payment…');
      navigate(`/app/bookings?pay=${booking.id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      userId: user.userId,
      email: user.email,
      eventId: id,
    });
  };

  if (isLoading) return <div className="page-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="booking-layout">
        <div className="booking-form-card">
          <h1>Book Tickets</h1>
          <h2 className="booking-event-name">{event?.title}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" {...register('fullName')} />
              {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" {...register('phone')} />
              {errors.phone && <span className="form-error">{errors.phone.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="numberOfTickets">Number of Tickets</label>
              <input id="numberOfTickets" type="number" min={1} {...register('numberOfTickets')} />
              {errors.numberOfTickets && <span className="form-error">{errors.numberOfTickets.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="seatPreference">Seat Preference</label>
              <select id="seatPreference" {...register('seatPreference')}>
                <option value="ANY">Any</option>
                <option value="FRONT">Front</option>
                <option value="MIDDLE">Middle</option>
                <option value="BACK">Back</option>
              </select>
              {errors.seatPreference && <span className="form-error">{errors.seatPreference.message}</span>}
            </div>

            {estimate !== null && (
              <div className="estimate-box">
                <span>Estimated Total</span>
                <strong>{estimate === 0 ? 'FREE' : `₹${estimate}`}</strong>
                <small>*Backend will calculate the exact amount</small>
              </div>
            )}

            <button type="submit" className="btn-primary full-width" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? 'Creating Booking…' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
