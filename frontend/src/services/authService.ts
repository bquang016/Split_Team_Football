import api from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  async register(data: {
    username: string;
    fullName: string;
    jerseyNumber?: number;
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

  async quickLogin(userId: string): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>(`/api/auth/quick-login/${userId}`);
    return res.data;
  },

  async getQuickUsers(): Promise<ApiResponse<User[]>> {
    const res = await api.get<ApiResponse<User[]>>('/api/auth/quick-users');
    return res.data;
  },
};
