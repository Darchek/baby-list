import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
  created_at?: Date;
  token?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  login: (userData: Omit<User, 'isLoggedIn'>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      
      setUser: (user: User) => {
        user.isLoggedIn = true;
        set({ user });
      },
      
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      logout: () => set({ user: null }),
      
      login: (userData: Omit<User, 'isLoggedIn'>) => {
        set({ 
          user: { 
            ...userData, 
            isLoggedIn: true 
          } 
        });
      },
    }),
    {
      name: 'baby-list-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
