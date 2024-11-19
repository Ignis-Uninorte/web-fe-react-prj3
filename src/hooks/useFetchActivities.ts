import { FollowUp } from '../types/followup.type';
import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/activities';

export const useFetchActivities = () => {
    return useQuery<FollowUp[], Error>({
        queryKey: ['activities'], 
        queryFn: async () => {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            return response.json();
        },
    });
};
