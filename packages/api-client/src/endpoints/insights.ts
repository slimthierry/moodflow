import { apiClient } from '../client';
import type { InsightReport, ApiResponse } from '@moodflow/types';

export const insightsApi = {
  generate: async (days: number = 30): Promise<ApiResponse<InsightReport>> => {
    const response = await apiClient.post('/api/v1/insights/generate', null, {
      params: { days },
    });
    return response.data;
  },

  list: async (limit: number = 10): Promise<ApiResponse<InsightReport[]>> => {
    const response = await apiClient.get('/api/v1/insights', {
      params: { limit },
    });
    return response.data;
  },
};
