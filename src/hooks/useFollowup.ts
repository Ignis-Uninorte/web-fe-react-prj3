import { useQuery, useMutation, useQueryClient}from '@tanstack/react-query';
import { getAllFollowUps, deleteFollowUp } from '../services/followup.services';

export function useAllFollowUps() {
    return useQuery({
        queryKey: ['followups'], 
        queryFn: getAllFollowUps 
    });
}

export function useDeleteFollowUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFollowUp,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['followups']});
        },
    });
}