import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { insightsApi } from '../endpoints/insights';

export function useInsightReports(limit: number = 10) {
  return useQuery({
    queryKey: ['insights', limit],
    queryFn: async () => {
      const response = await insightsApi.list(limit);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenerateInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: number = 30) => {
      const response = await insightsApi.generate(days);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}
