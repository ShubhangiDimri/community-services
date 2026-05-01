import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name too short').optional().or(z.literal('')),
  phone: z.string().min(10, 'Invalid phone').optional().or(z.literal('')),
});

export default function ProfilePage() {
  const { user, login } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.userId],
    queryFn: () => userApi.get(`/users/${user?.userId}`).then(r => r.data),
    enabled: !!user,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.name || '', phone: profile?.phone || '' },
  });

  const mutation = useMutation({
    mutationFn: (data) => userApi.put(`/users/${user.userId}`, data).then(r => r.data),
    onSuccess: (updated) => {
      toast.success('Profile updated!');
      login({ ...user, name: updated.name });
      queryClient.invalidateQueries(['profile', user.userId]);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  if (isLoading) return <div className="page-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="avatar-circle">{user?.name?.[0]?.toUpperCase()}</div>
          <h2>{profile?.name}</h2>
          <p className="profile-email">{profile?.email}</p>
          <span className={`badge ${profile?.role === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
            {profile?.role}
          </span>
          <p className="profile-id">ID: {profile?.id}</p>
        </div>

        <div className="form-card">
          <h3>Update Profile</h3>
          <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="auth-form">
            <div className="form-group">
              <label htmlFor="up-name">Name</label>
              <input id="up-name" type="text" {...register('name')} />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="up-phone">Phone</label>
              <input id="up-phone" type="tel" {...register('phone')} />
              {errors.phone && <span className="form-error">{errors.phone.message}</span>}
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
