import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('dsa_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dsa_token');
        localStorage.removeItem('dsa_user');
        // Only redirect if not already on auth pages
        const path = window.location.pathname;
        if (!path.startsWith('/login') && !path.startsWith('/register') && path !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, preferredLanguage?: string) =>
    api.post('/auth/signup', { name, email, password, preferredLanguage }),
  getMe: () => api.get('/auth/me'),
  logout: () => Promise.resolve(), // backend has no logout endpoint, JWT is stateless
};

// ─── Problems API ────────────────────────────────────────────────────────────
export const problemsAPI = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/problems', { params }),
  getOne: (id: string) => api.get(`/problems/${id}`),
  submit: (id: string, code: string, language: string) =>
    api.post(`/problems/${id}/submit`, { code, language }),
};

// ─── Assessment API ──────────────────────────────────────────────────────────
export const assessmentAPI = {
  getQuestions: () => api.get('/assessment/questions'),
  submit: (answers: Record<string, number>) =>
    api.post('/assessment/submit', { answers }),
};

// ─── Roadmap API ─────────────────────────────────────────────────────────────
export const roadmapAPI = {
  get: () => api.get('/roadmap'),
};

// ─── Code Runner API ─────────────────────────────────────────────────────────
export const codeAPI = {
  run: (code: string, language: string, input?: string) =>
    api.post('/code/run', { code, language, input }),
};

// ─── AI API ──────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat: (message: string, context?: string) =>
    api.post('/ai/chat', { message, context }),
};

// ─── Leaderboard API ─────────────────────────────────────────────────────────
export const leaderboardAPI = {
  get: (period?: string) => api.get('/leaderboard', { params: { period } }),
};

// ─── Users API ───────────────────────────────────────────────────────────────
export const usersAPI = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: Record<string, string>) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats'),
};

// ─── Platform API ──────────────────────────────────────────────────────────────
export const platformAPI = {
  getStats: () => api.get('/platform/stats'),
};

// ─── Execute API ─────────────────────────────────────────────────────────────
export const executeAPI = {
  submitCode: (data: { problemId: string, code: string, language: string }) => api.post('/execute/submit', data),
};
