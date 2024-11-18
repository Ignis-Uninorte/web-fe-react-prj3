import { useQuery } from '@tanstack/react-query';

export interface ClientContact {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

const CLIENTS_API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/clients';

export const useFetchContacts = () => {
  return useQuery<ClientContact[], Error>({
    queryKey: ['contacts'],  // Key used to identify this query
    queryFn: async () => {
      const response = await fetch(CLIENTS_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch client contacts');
      }
      const clients = await response.json();

      // Extraer los contactos de todos los clientes y devolverlos
      const contacts: ClientContact[] = clients.flatMap((client: any) => client.contacts || []);
      return contacts;
    },
  });
};
