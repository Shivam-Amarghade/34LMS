import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toasts: [],
  globalLoader: {
    active: false,
    message: null,
  },
  sidebarOpen: true,

  showToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Date.now().toString(), duration: toast.duration || 4000 },
      ],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  showGlobalLoader: (message) =>
    set({ globalLoader: { active: true, message } }),

  hideGlobalLoader: () =>
    set({ globalLoader: { active: false, message: null } }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
