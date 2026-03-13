import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { authAPI } from './api';

// Normalize backend response to match our User type
// Backend may return `id` instead of `_id`, and may omit some fields
function normalizeUser(raw: Record<string, unknown>): User {
  return {
    _id: (raw._id || raw.id || '') as string,
    name: (raw.name || '') as string,
    email: (raw.email || '') as string,
    role: (raw.role as 'user' | 'admin') || 'user',
    preferredLanguage: (raw.preferredLanguage as User['preferredLanguage']) || 'python',
    skillLevel: (raw.skillLevel as User['skillLevel']) || 'unassessed',
    coins: (raw.coins as number) || 0,
    streak: (raw.streak as number) || 0,
    longestStreak: (raw.longestStreak as number) || 0,
    totalSolved: (raw.totalSolved as number) || 0,
    assessmentCompleted: (raw.assessmentCompleted as boolean) || false,
    assessmentScore: (raw.assessmentScore as number) || 0,
    avatar: (raw.avatar as string) || '',
    bio: (raw.bio as string) || '',
    github: (raw.github as string) || '',
    linkedin: (raw.linkedin as string) || '',
    createdAt: (raw.createdAt as string) || new Date().toISOString(),
    updatedAt: (raw.updatedAt as string) || new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('dsa_token');
    const userStr = localStorage.getItem('dsa_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('dsa_token');
        localStorage.removeItem('dsa_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.login(email, password);
      const { token } = res.data;
      const user = normalizeUser(res.data.user);
      localStorage.setItem('dsa_token', token);
      localStorage.setItem('dsa_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, preferredLanguage?: string) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.register(name, email, password, preferredLanguage);
      const { token } = res.data;
      const user = normalizeUser(res.data.user);
      localStorage.setItem('dsa_token', token);
      localStorage.setItem('dsa_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('dsa_token');
    localStorage.removeItem('dsa_user');
    set({ user: null, token: null, isAuthenticated: false });
    authAPI.logout();
  },

  setUser: (user: User) => {
    localStorage.setItem('dsa_user', JSON.stringify(user));
    set({ user });
  },
}));
