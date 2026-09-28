import api from './api';
import { ApiResponse, Match, MatchGoal, MatchParticipant, MatchStatus, Team } from '../types';

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
    initialStatus?: MatchStatus;
    initialScoreTeamA?: number;
    initialScoreTeamB?: number;
  }): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>('/api/matches', data);
    return res.data;
  },

  async deleteMatch(id: string): Promise<ApiResponse<void>> {
    const res = await api.delete<ApiResponse<void>>(`/api/matches/${id}`);
    return res.data;
  },

  async restoreMatch(id: string): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>(`/api/matches/${id}/restore`);
    return res.data;
  },

  async getDeletedMatches(): Promise<ApiResponse<Match[]>> {
    const res = await api.get<ApiResponse<Match[]>>('/api/matches/deleted');
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

  async addParticipantsBatch(matchId: string, userIds: string[]): Promise<ApiResponse<MatchParticipant[]>> {
    const res = await api.post<ApiResponse<MatchParticipant[]>>(`/api/matches/${matchId}/participants/batch`, { userIds });
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

  async recordGoal(
    matchId: string,
    data: { scorerId: string; assistId?: string; team: Team; minute?: number; goalCount?: number }
  ): Promise<ApiResponse<MatchGoal>> {
    const res = await api.post<ApiResponse<MatchGoal>>(`/api/matches/${matchId}/goals`, data);
    return res.data;
  },

  async getMatchGoals(matchId: string): Promise<ApiResponse<MatchGoal[]>> {
    const res = await api.get<ApiResponse<MatchGoal[]>>(`/api/matches/${matchId}/goals`);
    return res.data;
  },

  async deleteGoal(matchId: string, goalId: string): Promise<ApiResponse<void>> {
    const res = await api.delete<ApiResponse<void>>(`/api/matches/${matchId}/goals/${goalId}`);
    return res.data;
  },
};
