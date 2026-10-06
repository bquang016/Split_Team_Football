import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  uploadMyAvatar: async (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<User>>('/api/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  removeMyAvatar: async (): Promise<ApiResponse<User>> => {
    const res = await api.delete<ApiResponse<User>>('/api/users/me/avatar');
    return res.data;
  },

  uploadUserAvatar: async (userId: string, file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<User>>(`/api/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  removeUserAvatar: async (userId: string): Promise<ApiResponse<User>> => {
    const res = await api.delete<ApiResponse<User>>(`/api/users/${userId}/avatar`);
    return res.data;
  },

  updateMyProfile: async (data: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    const res = await api.put<ApiResponse<User>>('/api/users/me/profile', data);
    return res.data;
  },

  updateUserProfile: async (userId: string, data: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    const res = await api.put<ApiResponse<User>>(`/api/users/${userId}/profile`, data);
    return res.data;
  },
};

export interface UpdateProfilePayload {
  fullName?: string;
  username?: string;
  email?: string;
  jerseyNumber?: number;
  favoritePosition?: string;
  currentPassword?: string;
  newPassword?: string;
}
