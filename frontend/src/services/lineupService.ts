import api from './api';
import { ApiResponse, MatchLineup, Position, Team } from '../types';

export interface LineupItemInput {
  userId: string;
  team: Team;
  positionLabel?: Position;
  xPercent?: number;
  yPercent?: number;
  jerseyNumber?: number;
}

export const lineupService = {
  async saveLineup(matchId: string, lineups: LineupItemInput[]): Promise<ApiResponse<MatchLineup[]>> {
    const res = await api.put<ApiResponse<MatchLineup[]>>(`/api/matches/${matchId}/lineup`, {
      lineups,
    });
    return res.data;
  },

  async getLineup(matchId: string, team?: Team): Promise<ApiResponse<MatchLineup[]>> {
    const url = team ? `/api/matches/${matchId}/lineup?team=${team}` : `/api/matches/${matchId}/lineup`;
    const res = await api.get<ApiResponse<MatchLineup[]>>(url);
    return res.data;
  },
};
