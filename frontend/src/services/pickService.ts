import api from './api';
import { ApiResponse, Match, MatchParticipant, Team } from '../types';

export const pickService = {
  async confirmPickRoundReady(matchId: string): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>(`/api/matches/${matchId}/pick/ready`);
    return res.data;
  },

  async pickTimeoutSwap(matchId: string): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>(`/api/matches/${matchId}/pick/timeout-swap`);
    return res.data;
  },

  async finalOddDecision(matchId: string, decision: 'ACCEPT' | 'BENCH'): Promise<ApiResponse<Match>> {
    const res = await api.post<ApiResponse<Match>>(`/api/matches/${matchId}/pick/final-odd-decision`, { decision });
    return res.data;
  },

  async pickPlayer(matchId: string, userId: string, team: Team, pickOrder?: number): Promise<ApiResponse<MatchParticipant>> {
    const res = await api.post<ApiResponse<MatchParticipant>>(`/api/matches/${matchId}/pick`, {
      userId,
      team,
      pickOrder,
    });
    return res.data;
  },

  async resetPick(matchId: string, userId: string): Promise<ApiResponse<MatchParticipant>> {
    const res = await api.post<ApiResponse<MatchParticipant>>(`/api/matches/${matchId}/pick/reset`, {
      userId,
    });
    return res.data;
  },
};
