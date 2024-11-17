import { useQuery } from '@tanstack/react-query';

export interface ClientContact {
    id: string;
    name: string;
}

const CONTACTS_API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/contacts';

export const useFetchContacts = () => {
    return useQuery<ClientContact[], Error>({
        queryKey: ['contacts'], // Key used to identify this query
        queryFn: async () => {
            const response = await fetch(CONTACTS_API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch client contacts');
            }
            return response.json();
        },
    });
};
