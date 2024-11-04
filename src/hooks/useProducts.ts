import { useQuery } from '@tanstack/react-query';
import { getAllClients } from '../services/clients.services';

export function useAllProducts() {
  return useQuery({
    queryKey: ['clients'],  // Pass an object with `queryKey`
    queryFn: getAllClients  // This is the function that fetches the data
  });
}