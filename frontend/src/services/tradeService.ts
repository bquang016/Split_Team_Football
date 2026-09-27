import api from './api';
import { ApiResponse, TradeRequest } from '../types';

export const tradeService = {
  async getTrades(matchId: string): Promise<ApiResponse<TradeRequest[]>> {
    const res = await api.get<ApiResponse<TradeRequest[]>>(`/api/matches/${matchId}/trades`);
    return res.data;
  },

  async createTrade(
    matchId: string,
    playerOfferedId: string,
    playerWantedId: string
  ): Promise<ApiResponse<TradeRequest>> {
    const res = await api.post<ApiResponse<TradeRequest>>(`/api/matches/${matchId}/trades`, {
      playerOfferedId,
      playerWantedId,
    });
    return res.data;
  },

  async respondTrade(
    matchId: string,
    tradeId: string,
    accept: boolean
  ): Promise<ApiResponse<TradeRequest>> {
    const res = await api.post<ApiResponse<TradeRequest>>(
      `/api/matches/${matchId}/trades/${tradeId}/respond`,
      { accept }
    );
    return res.data;
  },

  async cancelTrade(matchId: string, tradeId: string): Promise<ApiResponse<TradeRequest>> {
    const res = await api.post<ApiResponse<TradeRequest>>(
      `/api/matches/${matchId}/trades/${tradeId}/cancel`
    );
    return res.data;
  },
};
