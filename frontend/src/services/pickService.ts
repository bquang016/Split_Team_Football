import api from './api';
import { ApiResponse, MatchParticipant, Team } from '../types';

export const pickService = {
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
