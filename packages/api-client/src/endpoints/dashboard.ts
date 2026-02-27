import { apiClient } from '../client';
import type { DashboardData, ApiResponse } from '@moodflow/types';

export const dashboardApi = {
  get: async (): Promise<ApiResponse<DashboardData>> => {
    const response = await apiClient.get('/api/v1/dashboard');
    return response.data;
  },
};
