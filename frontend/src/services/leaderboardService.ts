import api from './api';
import { ApiResponse, LeaderboardItem } from '../types';

export const leaderboardService = {
  async getLeaderboard(type: 'goals' | 'wins' | 'assists' = 'goals'): Promise<ApiResponse<LeaderboardItem[]>> {
    const res = await api.get<ApiResponse<LeaderboardItem[]>>(`/api/leaderboard?type=${type}`);
    return res.data;
  },

  async refreshLeaderboard(): Promise<ApiResponse<void>> {
    const res = await api.post<ApiResponse<void>>('/api/leaderboard/refresh');
    return res.data;
  },
};
