import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../endpoints/journal';
import type { JournalEntryCreate, JournalEntryUpdate } from '@moodflow/types';

export function useJournalEntries(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['journal', params],
    queryFn: async () => {
      const response = await journalApi.list(params);
      return response.data!;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useJournalEntry(id: string) {
  return useQuery({
    queryKey: ['journal', id],
    queryFn: async () => {
      const response = await journalApi.getById(id);
      return response.data!;
    },
    enabled: !!id,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JournalEntryCreate) => {
      const response = await journalApi.create(data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JournalEntryUpdate }) => {
      const response = await journalApi.update(id, data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await journalApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
  });
}
