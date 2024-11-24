import { useQuery } from '@tanstack/react-query';

export interface ClientContact {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

const OPPORTUNITIES_API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/opportunities';
const CLIENTS_API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/clients';

export const useFetchContactsFromClients = (opportunityId: string | undefined) => {
  return useQuery<ClientContact[], Error>({
    queryKey: ['contacts', opportunityId],
    queryFn: async () => {
      if (!opportunityId) {
        console.log('Error: opportunityId is undefined');
        throw new Error('opportunityId is required');
      }

      // Obtener todas las oportunidades
      const opportunitiesResponse = await fetch(OPPORTUNITIES_API_URL);
      if (!opportunitiesResponse.ok) {
        console.error('Error al cargar las oportunidades:', opportunitiesResponse.status);
        throw new Error('Failed to fetch opportunities');
      }
      const opportunities = await opportunitiesResponse.json();
      console.log('Oportunidades:', opportunities);

      // Buscar la oportunidad que coincide con el opportunityId
      const opportunity = opportunities.find((o: { Id: string }) => o.Id === opportunityId);
      console.log('Oportunidad encontrada:', opportunity);
      if (!opportunity) {
        console.error('Error: Oportunidad no encontrada con id:', opportunityId);
        throw new Error('Opportunity not found');
      }

      const clientId = Number(opportunity.clientId); // Convertir clientId a número
      console.log('Client ID asociado a la oportunidad:', clientId);
      if (!clientId) {
        console.error('Error: La oportunidad no tiene un clientId asociado');
        throw new Error('Client ID not found in opportunity');
      }

      // Obtener todos los clientes
      const clientsResponse = await fetch(CLIENTS_API_URL);
      if (!clientsResponse.ok) {
        console.error('Error al cargar los clientes:', clientsResponse.status);
        throw new Error('Failed to fetch clients');
      }
      const clients = await clientsResponse.json();
      console.log('Clientes:', clients);

      // Buscar el cliente correspondiente usando el clientId
      const client = clients.find((c: { id: number }) => c.id === clientId); // Comparación como número
      console.log('Cliente encontrado:', client);
      if (!client) {
        console.error('Error: Cliente no encontrado con id:', clientId);
        throw new Error('Client not found');
      }

      // Verificar si el cliente tiene contactos
      if (!client.contacts || client.contacts.length === 0) {
        console.warn('Advertencia: No se encontraron contactos para el cliente con id:', clientId);
        throw new Error('No contacts found for the client');
      }

      console.log('Contactos del cliente:', client.contacts);
      return client.contacts;
    },
    enabled: !!opportunityId,
  });
};
