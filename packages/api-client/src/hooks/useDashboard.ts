import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../endpoints/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardApi.get();
      return response.data!;
    },
    staleTime: 2 * 60 * 1000,
  });
}
