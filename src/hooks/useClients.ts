import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllClients, toggleClientStatus } from '../services/clients.services';

export function useAllClients() {
  return useQuery({
    queryKey: ['clients'],  // Pass an object with `queryKey`
    queryFn: getAllClients  // This is the function that fetches the data
  });
}

export function useToggleClientStatus() {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: ({ clientId, currentStatus }: { clientId: number; currentStatus: boolean }) => toggleClientStatus(clientId, currentStatus),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['clients'] });
      }
  });
}