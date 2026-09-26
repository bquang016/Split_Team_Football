import api from './api';
import { AIAnalysis, ApiResponse } from '../types';

export const aiService = {
  async generateAnalysis(matchId: string): Promise<ApiResponse<AIAnalysis>> {
    const res = await api.post<ApiResponse<AIAnalysis>>(`/api/matches/${matchId}/ai-analysis`);
    return res.data;
  },
};
