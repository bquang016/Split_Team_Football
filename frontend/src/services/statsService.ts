import api from './api';
import { ApiResponse, PlayerStats, Team } from '../types';

export interface PlayerStatInput {
  userId: string;
  team: Team;
  goals: number;
  assists: number;
  isWinner: boolean;
  isMvp: boolean;
}

export const statsService = {
  async recordStats(matchId: string, stats: PlayerStatInput[]): Promise<ApiResponse<PlayerStats[]>> {
    const res = await api.post<ApiResponse<PlayerStats[]>>(`/api/matches/${matchId}/stats`, { stats });
    return res.data;
  },

  async getMatchStats(matchId: string): Promise<ApiResponse<PlayerStats[]>> {
    const res = await api.get<ApiResponse<PlayerStats[]>>(`/api/matches/${matchId}/stats`);
    return res.data;
  },

  async getPlayerStats(userId: string): Promise<ApiResponse<PlayerStats[]>> {
    const res = await api.get<ApiResponse<PlayerStats[]>>(`/api/stats/player/${userId}`);
    return res.data;
  },
};
