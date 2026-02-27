import { apiClient } from '../client';
import type { LoginRequest, RegisterRequest, TokenResponse, User, ApiResponse } from '@moodflow/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data;
  },

  me: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<TokenResponse>> => {
    const response = await apiClient.post('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
