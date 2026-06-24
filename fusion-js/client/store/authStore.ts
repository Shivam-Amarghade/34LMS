import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('auth_token'),
  user: null,
  role: null,
  permissions: [],
  sessionExpiry: null,
  status: 'idle',
  error: null,

  initSession: ({ token, user, role, permissions = [] }) => {
    localStorage.setItem('auth_token', token);
    set({
      token,
      user,
      role,
      permissions,
      status: 'authenticated',
      error: null,
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({
      token: null,
      user: null,
      role: null,
      permissions: [],
      status: 'idle',
    });
  },

  setAuthError: (error) => set({ error, status: 'error' }),

  clearAuthError: () => set({ error: null }),
}));
