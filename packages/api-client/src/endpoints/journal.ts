import { apiClient } from '../client';
import type { JournalEntry, JournalEntryCreate, JournalEntryUpdate, ApiResponse } from '@moodflow/types';

export const journalApi = {
  create: async (data: JournalEntryCreate): Promise<ApiResponse<JournalEntry>> => {
    const response = await apiClient.post('/api/v1/journal', data);
    return response.data;
  },

  list: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<JournalEntry[]>> => {
    const response = await apiClient.get('/api/v1/journal', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<JournalEntry>> => {
    const response = await apiClient.get(`/api/v1/journal/${id}`);
    return response.data;
  },

  update: async (id: string, data: JournalEntryUpdate): Promise<ApiResponse<JournalEntry>> => {
    const response = await apiClient.put(`/api/v1/journal/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/v1/journal/${id}`);
    return response.data;
  },
};
