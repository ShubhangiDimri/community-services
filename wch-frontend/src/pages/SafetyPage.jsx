import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Shield, AlertTriangle, Phone, UserPlus, X } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  relationship: z.string().optional(),
});

export default function SafetyPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sosModal, setSosModal] = useState(false);
  const [sosResult, setSosResult] = useState('');

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['emergency-contacts', user?.userId],
    queryFn: () => userApi.get('/users/emergency-contact').then(r => r.data),
    enabled: !!user,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const addContact = useMutation({
    mutationFn: (data) => userApi.post('/users/emergency-contact', data).then(r => r.data),
    onSuccess: () => {
      toast.success('Emergency contact added!');
      reset();
      queryClient.invalidateQueries(['emergency-contacts', user?.userId]);
    },
    onError: () => toast.error('Failed to add contact'),
  });

  const sosMutation = useMutation({
    mutationFn: () => userApi.post('/users/sos').then(r => r.data),
    onSuccess: (data) => {
      setSosResult(data.message || 'SOS triggered! Emergency contacts are being notified.');
      setSosModal(false);
      toast.success('SOS Alert Sent!');
    },
    onError: (err) => {
      setSosModal(false);
      toast.error(err.response?.data?.message || 'SOS failed');
    },
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Shield size={28} /> Safety Center</h1>
        <p>Manage emergency contacts and trigger SOS alerts</p>
      </div>

      {/* SOS Button */}
      <div className="sos-section">
        <div className="sos-card">
          <AlertTriangle size={40} className="sos-icon" />
          <h2>Emergency SOS</h2>
          <p>Trigger an emergency alert to all your emergency contacts immediately.</p>
          <button
            id="sos-trigger-btn"
            className="btn-sos"
            onClick={() => setSosModal(true)}
          >
            🆘 TRIGGER SOS ALERT
          </button>
          {sosResult && (
            <div className="sos-result">
              <CheckCircle /> <p>{sosResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      {sosModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sos-modal-title">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setSosModal(false)} aria-label="Close modal">
              <X size={20} />
            </button>
            <AlertTriangle size={48} className="sos-icon" />
            <h2 id="sos-modal-title">Confirm SOS Alert</h2>
            <p>This will notify ALL your emergency contacts immediately. Are you sure?</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setSosModal(false)}>Cancel</button>
              <button
                id="sos-confirm-btn"
                className="btn-sos"
                onClick={() => sosMutation.mutate()}
                disabled={sosMutation.isPending}
                autoFocus
              >
                {sosMutation.isPending ? 'Sending…' : '🆘 Yes, Send SOS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="contacts-section">
        <h2>Emergency Contacts</h2>

        {isLoading && <div className="loader" />}

        {!isLoading && contacts.length === 0 && (
          <div className="empty-state">
            <Phone size={40} />
            <p>No emergency contacts yet. Add one below.</p>
          </div>
        )}

        <div className="contacts-grid">
          {contacts.map((c, i) => (
            <div key={i} className="contact-card">
              <div className="contact-avatar">{c.name?.[0]?.toUpperCase()}</div>
              <div className="contact-info">
                <strong>{c.name}</strong>
                <span>{c.phone}</span>
                {c.relationship && <span className="badge badge-muted">{c.relationship}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        <div className="form-card">
          <h3><UserPlus size={20} /> Add Emergency Contact</h3>
          <form onSubmit={handleSubmit(d => addContact.mutate(d))} className="auth-form">
            <div className="form-group">
              <label htmlFor="ec-name">Name</label>
              <input id="ec-name" {...register('name')} placeholder="Contact name" />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="ec-phone">Phone</label>
              <input id="ec-phone" type="tel" {...register('phone')} placeholder="9876543210" />
              {errors.phone && <span className="form-error">{errors.phone.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="ec-rel">Relationship</label>
              <input id="ec-rel" {...register('relationship')} placeholder="e.g. Sister, Friend" />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting || addContact.isPending}>
              {addContact.isPending ? 'Adding…' : 'Add Contact'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
