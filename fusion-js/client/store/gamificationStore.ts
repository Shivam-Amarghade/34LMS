import { create } from 'zustand';

export const useGamificationStore = create((set) => ({
  myScore: {
    totalPoints: 0,
    currentLevel: 'BEGINNER',
    currentLevelMinPoints: 0,
    nextLevelMinPoints: 100,
    badges: [],
    tFactor: 0,
    status: 'idle',
  },
  leaderboard: {
    data: [],
    myRank: null,
    status: 'idle',
  },

  setMyScore: ({ totalPoints, currentLevel, nextLevelMinPoints, badges, tFactor }) =>
    set((state) => ({
      myScore: {
        ...state.myScore,
        totalPoints,
        currentLevel,
        nextLevelMinPoints,
        badges,
        tFactor,
        status: 'succeeded',
      },
    })),

  setLeaderboard: ({ data, myRank }) =>
    set((state) => ({
      leaderboard: { ...state.leaderboard, data, myRank, status: 'succeeded' },
    })),
}));
