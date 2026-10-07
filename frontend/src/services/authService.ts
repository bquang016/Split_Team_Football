import api from './api';
import { ApiResponse, AuthResponse, CheckAvailabilityResult, User } from '../types';

export const authService = {
  async register(data: {
    username: string;
    fullName: string;
    jerseyNumber?: number;
    favoritePosition?: string;
    email?: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    const res = await api.post<ApiResponse<User>>('/api/auth/register', data);
    return res.data;
  },

  async login(data: { username: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const res = await api.get<ApiResponse<User>>('/api/auth/me');
    return res.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const res = await api.post<ApiResponse<void>>('/api/auth/logout');
    return res.data;
  },


  async checkAvailability(params: {
    username?: string;
    email?: string;
    jerseyNumber?: number;
    excludeUserId?: string;
    forGuest?: boolean;
  }): Promise<ApiResponse<CheckAvailabilityResult>> {
    const res = await api.get<ApiResponse<CheckAvailabilityResult>>('/api/auth/check-availability', {
      params,
    });
    return res.data;
  },
};
