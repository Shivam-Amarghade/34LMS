import { create } from 'zustand';

export const useCompetencyStore = create((set) => ({
  profile: {
    data: [],
    status: 'idle',
  },

  setProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, data, status: 'succeeded' },
    })),

  setProfileStatus: (status) =>
    set((state) => ({
      profile: { ...state.profile, status },
    })),
}));
