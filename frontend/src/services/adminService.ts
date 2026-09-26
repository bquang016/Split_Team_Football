import api from './api';
import { ApiResponse, User, UserRole, UserStatus } from '../types';

export const adminService = {
  async getUsers(status?: UserStatus): Promise<ApiResponse<User[]>> {
    const url = status ? `/api/admin/users?status=${status}` : '/api/admin/users';
    const res = await api.get<ApiResponse<User[]>>(url);
    return res.data;
  },

  async approveUser(userId: string): Promise<ApiResponse<User>> {
    const res = await api.patch<ApiResponse<User>>(`/api/admin/users/${userId}/approve`);
    return res.data;
  },

  async banUser(userId: string): Promise<ApiResponse<User>> {
    const res = await api.patch<ApiResponse<User>>(`/api/admin/users/${userId}/ban`);
    return res.data;
  },

  async updateUser(
    userId: string,
    data: { fullName?: string; jerseyNumber?: number; email?: string; role?: UserRole; status?: UserStatus }
  ): Promise<ApiResponse<User>> {
    const res = await api.put<ApiResponse<User>>(`/api/admin/users/${userId}`, data);
    return res.data;
  },
};
