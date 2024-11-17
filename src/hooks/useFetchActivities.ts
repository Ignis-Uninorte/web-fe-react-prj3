import { useQuery } from '@tanstack/react-query';

export interface Activity {
    id: number;
    contactType: string;
    contactDate: string;
    clientContact: string;
    description: string;
}

const API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/activities';

export const useFetchActivities = () => {
    return useQuery<Activity[], Error>({
        queryKey: ['activities'], // Key used to identify this query
        queryFn: async () => {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            return response.json();
        },
    });
};
