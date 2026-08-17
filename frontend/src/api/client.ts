import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('fl_refresh');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refresh });
          localStorage.setItem('fl_token', data.access_token);
          localStorage.setItem('fl_refresh', data.refresh_token);
          error.config.headers.Authorization = `Bearer ${data.access_token}`;
          return api(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  refresh: (token: string) => api.post('/auth/refresh', { refresh_token: token }),
};

export const usersApi = {
  me: () => api.get('/users/me'),
  update: (data: any) => api.put('/users/me', data),
  delete: () => api.delete('/users/me'),
};

export const merchantsApi = {
  getAll: () => api.get('/merchants'),
  getById: (id: string) => api.get(`/merchants/${id}`),
  getMyMerchant: () => api.get('/merchants/me/profile'),
  getDashboard: () => api.get('/merchants/me/dashboard'),
  create: (data: any) => api.post('/merchants', data),
  update: (id: string, data: any) => api.put(`/merchants/${id}`, data),
};

export const offersApi = {
  getAll: () => api.get('/offers'),
  getMyOffers: () => api.get('/offers/my'),
  create: (data: any) => api.post('/offers', data),
  update: (id: string, data: any) => api.put(`/offers/${id}`, data),
  delete: (id: string) => api.delete(`/offers/${id}`),
};

export const loyaltyApi = {
  getBalances: () => api.get('/loyalty/balances'),
  getBalance: (merchantId: string) => api.get(`/loyalty/balances/${merchantId}`),
  convert: (merchantId: string, peAmount: number) => api.post('/loyalty/convert', { merchantId, peAmount }),
};

export const transactionsApi = {
  scan: (merchantId: string, amount: number) => api.post('/transactions/scan', { merchantId, amount }),
  getMy: () => api.get('/transactions/my'),
  getMerchant: () => api.get('/transactions/merchant'),
};

export const eventsApi = {
  getAll: () => api.get('/events'),
  create: (data: any) => api.post('/events', data),
  register: (eventId: string) => api.post(`/events/${eventId}/register`),
  getMyRegistrations: () => api.get('/events/my/registrations'),
  getMerchantEvents: () => api.get('/events/my/merchant'),
};

export const subscriptionsApi = {
  follow: (merchantId: string) => api.post(`/subscriptions/follow/${merchantId}`),
  getFollowing: () => api.get('/subscriptions/following'),
  check: (merchantId: string) => api.get(`/subscriptions/check/${merchantId}`),
};

export const adminApi = {
  getMerchants: () => api.get('/admin/merchants'),
  approve: (id: string) => api.put(`/admin/merchants/${id}/approve`),
  suspend: (id: string) => api.put(`/admin/merchants/${id}/suspend`),
};
