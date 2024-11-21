import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllClients, toggleClientStatus, getClientByNit, getNextClientId } from '../services/clients.services';


export function useAllClients() {
  return useQuery({
    queryKey: ['clients'], 
    queryFn: getAllClients  // Función que obtiene todos los clientes
  });
}


export function useToggleClientStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, currentStatus }: { clientId: number; currentStatus: boolean }) => toggleClientStatus(clientId, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientsStatus'] });
    }
  });
}

// datos de un cliente específico
export function useClientData(nit: string | undefined) {
  return useQuery({
    queryKey: ['client', nit],
    queryFn: () => getClientByNit(nit),
    enabled: !!nit, 
  });
}

// para obtener el proximo ID del cliente
export function useNextClientId() {
  return useQuery({
    queryKey: ['nextClientId'],
    queryFn: getNextClientId
  });
}
