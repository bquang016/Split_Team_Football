import api from './api';
import { ApiResponse, LeaderboardItem, RatingLeaderboardItem } from '../types';

export const leaderboardService = {
  async getLeaderboard(type: 'goals' | 'wins' | 'assists' = 'goals'): Promise<ApiResponse<LeaderboardItem[]>> {
    const res = await api.get<ApiResponse<LeaderboardItem[]>>(`/api/leaderboard?type=${type}`);
    return res.data;
  },

  async getRatingLeaderboard(period: 'week' | 'month' | 'all' = 'week'): Promise<ApiResponse<RatingLeaderboardItem[]>> {
    const res = await api.get<ApiResponse<RatingLeaderboardItem[]>>(`/api/leaderboard/rating?period=${period}`);
    return res.data;
  },

  async refreshLeaderboard(): Promise<ApiResponse<void>> {
    const res = await api.post<ApiResponse<void>>('/api/leaderboard/refresh');
    return res.data;
  },
};
