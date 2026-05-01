import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userApi } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'USER' },
  });

  const onSubmit = async (data) => {
    try {
      await userApi.post('/users/register', data);
      toast.success('Registered! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🏛️</span>
          <h1>Create Account</h1>
          <p>Join Women Community Hall</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" placeholder="Priya Sharma" {...register('name')} />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" placeholder="priya@example.com" {...register('email')} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="tel" placeholder="9876543210" {...register('phone')} />
            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input id="reg-password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select id="role" {...register('role')}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-primary full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
