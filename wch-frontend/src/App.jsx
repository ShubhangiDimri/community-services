import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequireAdmin } from './components/RouteGuards';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import SafetyPage from './pages/SafetyPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import ForumsPage from './pages/ForumsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="video-background">
            <video autoPlay muted loop playsInline id="bg-video">
              <source src="/community.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
          </div>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />

              {/* Booking requires auth */}
              <Route path="/events/:id/book" element={
                <RequireAuth><BookingPage /></RequireAuth>
              } />

              {/* Authenticated user routes */}
              <Route path="/app" element={<RequireAuth><DashboardPage /></RequireAuth>} />
              <Route path="/app/bookings" element={<RequireAuth><MyBookingsPage /></RequireAuth>} />
              <Route path="/app/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/app/safety" element={<RequireAuth><SafetyPage /></RequireAuth>} />
              <Route path="/app/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
              <Route path="/app/forums" element={<RequireAuth><ForumsPage /></RequireAuth>} />

              {/* Admin routes */}
              <Route path="/admin/events" element={<RequireAdmin><AdminEventsPage /></RequireAdmin>} />
              <Route path="/admin/bookings" element={<RequireAdmin><AdminBookingsPage /></RequireAdmin>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/events" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
