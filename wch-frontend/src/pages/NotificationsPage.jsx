import { useQuery } from '@tanstack/react-query';
import { notifApi } from '../lib/api';
import { Bell, RefreshCw } from 'lucide-react';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notifApi.get('/notifications').then(r => r.data),
    refetchInterval: 15000, // poll every 15s
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><Bell size={28} /> Notifications</h1>
          <p>Real-time alerts from the notification service (ephemeral — resets on restart)</p>
        </div>
        <button className="btn-outline icon-btn" onClick={() => refetch()} disabled={isFetching} aria-label="Refresh notifications">
          <RefreshCw size={16} className={isFetching ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {isLoading && <div className="loader" />}

      {isError && (
        <div className="empty-state error-state">
          <span>⚠️</span>
          <p>Could not connect to Notification Service on port 8089.</p>
        </div>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <div className="empty-state">
          <Bell size={48} />
          <p>No notifications yet. They appear here after booking confirmations and SOS alerts.</p>
        </div>
      )}

      <div className="notifications-list">
        {[...notifications].reverse().map((n, i) => (
          <div key={i} className="notification-item">
            <div className="notif-avatar">{n.name?.[0]?.toUpperCase() || '🔔'}</div>
            <div className="notif-content">
              <strong>{n.name}</strong>
              <p>{n.message}</p>
            </div>
            <span className="notif-badge">NEW</span>
          </div>
        ))}
      </div>
    </div>
  );
}
