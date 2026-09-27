import api from './api';
import { ApiResponse, Match, MatchParticipant, MatchStatus } from '../types';

export const matchService = {
  async getMatches(startDate?: string, endDate?: string): Promise<ApiResponse<Match[]>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await api.get<ApiResponse<Match[]>>(`/api/matches?${params.toString()}`);
    return res.data;
  },

  async getMatchDetails(id: string): Promise<ApiResponse<Match>> {
    const res = await api.get<ApiResponse<Match>>(`/api/matches/${id}`);
    return res.data;
  },

  async createMatch(data: {
    title?: string;
    matchDate: string;
    matchTime?: string;
    location?: string;
    notes?: string;
  }): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>('/api/matches', data);
    return res.data;
  },

  async updateMatchStatus(id: string, status: MatchStatus): Promise<ApiResponse<Match>> {
    const res = await api.patch<ApiResponse<Match>>(`/api/matches/${id}/status`, { status });
    return res.data;
  },

  async joinMatch(id: string): Promise<ApiResponse<MatchParticipant>> {
    const res = await api.post<ApiResponse<MatchParticipant>>(`/api/matches/${id}/join`);
    return res.data;
  },

  async leaveMatch(id: string): Promise<ApiResponse<void>> {
    const res = await api.delete<ApiResponse<void>>(`/api/matches/${id}/leave`);
    return res.data;
  },

  async addParticipant(matchId: string, userId: string): Promise<ApiResponse<MatchParticipant>> {
    const res = await api.post<ApiResponse<MatchParticipant>>(`/api/matches/${matchId}/participants`, { userId });
    return res.data;
  },

  async removeParticipant(matchId: string, userId: string): Promise<ApiResponse<void>> {
    const res = await api.delete<ApiResponse<void>>(`/api/matches/${matchId}/participants/${userId}`);
    return res.data;
  },

  async updateScore(matchId: string, scoreTeamA: number, scoreTeamB: number): Promise<ApiResponse<Match>> {
    const res = await api.patch<ApiResponse<Match>>(`/api/matches/${matchId}/score`, { scoreTeamA, scoreTeamB });
    return res.data;
  },

  async selectJersey(matchId: string, jerseyTeam: string): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>(`/api/matches/${matchId}/select-jersey`, { jerseyTeam });
    return res.data;
  },
};
