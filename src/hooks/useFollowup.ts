import { useQuery }from '@tanstack/react-query';
import { getAllFollowUps } from '../services/followup.services';

export function useAllFollowUps() {
    return useQuery({
        queryKey: ['followups'], 
        queryFn: getAllFollowUps 
    });
}