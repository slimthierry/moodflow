import { apiClient } from '../client';
import type { MoodEntry, MoodEntryCreate, MoodEntryUpdate, ApiResponse } from '@moodflow/types';

export const moodsApi = {
  create: async (data: MoodEntryCreate): Promise<ApiResponse<MoodEntry>> => {
    const response = await apiClient.post('/api/v1/moods', data);
    return response.data;
  },

  list: async (params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<MoodEntry[]>> => {
    const response = await apiClient.get('/api/v1/moods', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<MoodEntry>> => {
    const response = await apiClient.get(`/api/v1/moods/${id}`);
    return response.data;
  },

  update: async (id: string, data: MoodEntryUpdate): Promise<ApiResponse<MoodEntry>> => {
    const response = await apiClient.put(`/api/v1/moods/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/v1/moods/${id}`);
    return response.data;
  },
};
