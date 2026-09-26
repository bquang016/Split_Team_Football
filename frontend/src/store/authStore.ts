import { create } from 'zustand';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
  toggleAdminMode: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: (token, refreshToken, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        set({ user: res.data, isAuthenticated: true, isLoading: false });
      } else {
        get().logout();
        set({ isLoading: false });
      }
    } catch {
      get().logout();
      set({ isLoading: false });
    }
  },

  isAdmin: () => {
    const user = get().user;
    return user?.role === 'ADMIN';
  },

  toggleAdminMode: () => {
    const user = get().user;
    if (!user) {
      // Create guest admin if not logged in
      const mockAdmin: User = {
        id: 'guest-admin',
        username: 'admin',
        fullName: 'Hùng Nguyễn (Admin)',
        jerseyNumber: 10,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      set({ user: mockAdmin, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(mockAdmin));
      return;
    }
    const newRole: UserRole = user.role === 'ADMIN' ? 'PLAYER' : 'ADMIN';
    const updatedUser = { ...user, role: newRole };
    set({ user: updatedUser });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
}));

