import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register/user', data);
export const registerProvider = (data) => api.post('/auth/register/provider', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ─── Services ────────────────────────────────────────────────────────────────
export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// ─── Providers ───────────────────────────────────────────────────────────────
export const getProviders = (params) => api.get('/providers', { params });
export const getNearbyProviders = (params) => api.get('/providers/nearby', { params });
export const getProvider = (id) => api.get(`/providers/${id}`);
export const updateAvailability = (data) => api.put('/providers/availability', data);
export const updateProviderProfile = (data) => api.put('/providers/profile', data);
export const getProviderReviews = (id) => api.get(`/providers/${id}/reviews`);

// ─── Requests ────────────────────────────────────────────────────────────────
export const createRequest = (data) => api.post('/requests', data);
export const getRequests = () => api.get('/requests');
export const getRequest = (id) => api.get(`/requests/${id}`);
export const acceptRequest = (id) => api.post(`/requests/${id}/accept`);
export const rejectRequest = (id) => api.post(`/requests/${id}/reject`);
export const providerArriving = (id) => api.post(`/requests/${id}/arriving`);
export const startService = (id) => api.post(`/requests/${id}/start`);
export const completeService = (id) => api.post(`/requests/${id}/complete`);
export const cancelRequest = (id) => api.post(`/requests/${id}/cancel`);

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const createReview = (data) => api.post('/reviews', data);
export const getMyReviews = () => api.get('/reviews/my');

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () => api.get('/notifications');
export const markNotifRead = (id) => api.post(`/notifications/${id}/read`);
export const markAllRead = () => api.post('/notifications/mark-all-read');

export default api;

// ─── Provider Services (custom) ───────────────────────────────────────────────
export const getMyProviderServices = () => api.get('/provider-services/my');
export const addProviderService = (data) => api.post('/provider-services/add', data);
export const removeProviderService = (psId) => api.delete(`/provider-services/${psId}`);
export const searchServiceCatalog = (q) => api.get('/provider-services/search-catalog', { params: { q } });
export const searchProviders = (q, lat, lon) => api.get('/provider-services/search-providers', { params: { q, lat, lon } });
