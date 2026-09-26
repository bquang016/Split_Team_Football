import api from './api';
import { ApiResponse, SpinSession } from '../types';

export const spinService = {
  async startSpin(matchId: string, hostAId: string, hostBId: string): Promise<ApiResponse<SpinSession>> {
    const res = await api.post<ApiResponse<SpinSession>>(`/api/matches/${matchId}/spin`, {
      hostAId,
      hostBId,
    });
    return res.data;
  },

  async getLatestSpin(matchId: string): Promise<ApiResponse<SpinSession>> {
    const res = await api.get<ApiResponse<SpinSession>>(`/api/matches/${matchId}/spin/latest`);
    return res.data;
  },
};
