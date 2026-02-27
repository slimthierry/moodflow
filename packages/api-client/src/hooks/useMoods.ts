import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { moodsApi } from '../endpoints/moods';
import type { MoodEntryCreate, MoodEntryUpdate } from '@moodflow/types';

export function useMoodEntries(params?: {
  start_date?: string;
  end_date?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['moods', params],
    queryFn: async () => {
      const response = await moodsApi.list(params);
      return response.data!;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMoodEntry(id: string) {
  return useQuery({
    queryKey: ['moods', id],
    queryFn: async () => {
      const response = await moodsApi.getById(id);
      return response.data!;
    },
    enabled: !!id,
  });
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MoodEntryCreate) => {
      const response = await moodsApi.create(data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateMoodEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MoodEntryUpdate }) => {
      const response = await moodsApi.update(id, data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteMoodEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await moodsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
