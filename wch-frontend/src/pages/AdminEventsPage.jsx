import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '../lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().min(5, 'Description required'),
  date: z.string().min(1, 'Date required'),
  time: z.string().min(1, 'Time required'),
  location: z.string().min(2, 'Location required'),
  category: z.string().optional(),
  basePrice: z.coerce.number().min(0),
  frontSurcharge: z.coerce.number().optional(),
  middleSurcharge: z.coerce.number().optional(),
  free: z.boolean().optional(),
  bookingOpen: z.boolean().optional(),
});

export default function AdminEventsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // event being edited
  const [showForm, setShowForm] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.get('/events').then(r => r.data),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { free: false, bookingOpen: true, basePrice: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (data) => eventApi.post('/events', data).then(r => r.data),
    onSuccess: () => { toast.success('Event created!'); qc.invalidateQueries(['events']); reset(); setShowForm(false); },
    onError: () => toast.error('Failed to create event'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => eventApi.put(`/events/${id}`, data).then(r => r.data),
    onSuccess: () => { toast.success('Event updated!'); qc.invalidateQueries(['events']); setEditing(null); setShowForm(false); reset(); },
    onError: () => toast.error('Failed to update event'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventApi.delete(`/events/${id}`),
    onSuccess: () => { toast.success('Event deleted!'); qc.invalidateQueries(['events']); },
    onError: () => toast.error('Failed to delete event'),
  });

  const onSubmit = (data) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const startEdit = (event) => {
    setEditing(event);
    setShowForm(true);
    Object.entries(event).forEach(([k, v]) => setValue(k, v));
  };

  const cancelForm = () => { setEditing(null); setShowForm(false); reset(); };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Event Management</h1>
        <button className="btn-primary" onClick={() => { setEditing(null); reset(); setShowForm(!showForm); }}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-card admin-form">
          <div className="form-card-header">
            <h2>{editing ? 'Edit Event' : 'Create New Event'}</h2>
            <button className="btn-ghost" onClick={cancelForm}><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="admin-event-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ev-title">Title *</label>
                <input id="ev-title" {...register('title')} />
                {errors.title && <span className="form-error">{errors.title.message}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="ev-category">Category</label>
                <input id="ev-category" {...register('category')} placeholder="e.g. Workshop, Cultural" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ev-desc">Description *</label>
              <textarea id="ev-desc" rows={3} {...register('description')} />
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ev-date">Date *</label>
                <input id="ev-date" type="date" {...register('date')} />
                {errors.date && <span className="form-error">{errors.date.message}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="ev-time">Time *</label>
                <input id="ev-time" type="time" {...register('time')} />
                {errors.time && <span className="form-error">{errors.time.message}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="ev-location">Location *</label>
                <input id="ev-location" {...register('location')} />
                {errors.location && <span className="form-error">{errors.location.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ev-price">Base Price (₹)</label>
                <input id="ev-price" type="number" min={0} {...register('basePrice')} />
              </div>
              <div className="form-group">
                <label htmlFor="ev-front">Front Surcharge (₹)</label>
                <input id="ev-front" type="number" min={0} {...register('frontSurcharge')} />
              </div>
              <div className="form-group">
                <label htmlFor="ev-mid">Middle Surcharge (₹)</label>
                <input id="ev-mid" type="number" min={0} {...register('middleSurcharge')} />
              </div>
            </div>

            <div className="form-row">
              <label className="filter-check">
                <input type="checkbox" {...register('free')} /> Free Event
              </label>
              <label className="filter-check">
                <input type="checkbox" {...register('bookingOpen')} /> Booking Open
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Update Event' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      {isLoading && <div className="loader" />}

      <div className="admin-events-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.date} {e.time}</td>
                <td>{e.location}</td>
                <td>{e.category || '—'}</td>
                <td>{(e.free || e.isFree) ? 'Free' : `₹${e.basePrice}`}</td>
                <td>
                  <span className={`badge ${e.bookingOpen ? 'badge-success' : 'badge-muted'}`}>
                    {e.bookingOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="btn-ghost icon-btn" onClick={() => startEdit(e)} title="Edit event">
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn-ghost icon-btn danger"
                    onClick={() => { if (confirm(`Delete "${e.title}"?`)) deleteMutation.mutate(e.id); }}
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && !isLoading && (
          <div className="empty-state"><p>No events yet. Create one above.</p></div>
        )}
      </div>
    </div>
  );
}
