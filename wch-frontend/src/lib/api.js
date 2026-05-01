import axios from 'axios';

const getToken = () => localStorage.getItem('wch_token');

const attachAuth = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const requestUrl = err.config?.url || '';
      const isAuthRequest = requestUrl.includes('/users/login') || requestUrl.includes('/users/register');

      if (err.response?.status === 401 && !isAuthRequest) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
  return instance;
};

export const userApi = attachAuth(
  axios.create({ baseURL: import.meta.env.VITE_USER_API })
);

export const eventApi = attachAuth(
  axios.create({ baseURL: import.meta.env.VITE_EVENT_API })
);

export const bookingApi = attachAuth(
  axios.create({ baseURL: import.meta.env.VITE_BOOKING_API })
);

export const notifApi = attachAuth(
  axios.create({ baseURL: import.meta.env.VITE_NOTIFICATION_API })
);

export const forumApi = attachAuth(
  axios.create({ baseURL: import.meta.env.VITE_FORUM_API })
);
