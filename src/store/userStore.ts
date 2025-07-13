import { User } from '@/types/user';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (userData: User | null) => void;
}

const initialState = {
  user: null,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  setUser: (userData) => {
    return set(() => ({ user: userData }));
  },
}));
