import { create } from 'zustand';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  quickLogin: (userId: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
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

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  quickLogin: async (userId: string) => {
    try {
      const res = await authService.quickLogin(userId);
      if (res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token: accessToken, user, isAuthenticated: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
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

  updateUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  isAdmin: () => {
    const user = get().user;
    return user?.role === 'ADMIN';
  },

  toggleAdminMode: async () => {
    try {
      const res = await authService.getQuickUsers();
      if (res.success && res.data && res.data.length > 0) {
        const currentUser = get().user;
        if (currentUser?.role === 'ADMIN') {
          // Switch to first player
          const player = res.data.find((u) => u.role !== 'ADMIN') || res.data[0];
          await get().quickLogin(player.id);
        } else {
          // Switch to admin
          const admin = res.data.find((u) => u.role === 'ADMIN') || res.data[0];
          await get().quickLogin(admin.id);
        }
        window.location.reload();
      }
    } catch (err) {
      console.error('Không thể chuyển đổi chế độ quản trị viên', err);
    }
  },
}));

