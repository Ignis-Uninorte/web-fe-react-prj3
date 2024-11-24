import { useQuery, useMutation, useQueryClient}from '@tanstack/react-query';
import { getAllFollowUps, deleteFollowUp } from '../services/followup.services';
import { FollowUp } from '../types/followup.type';

export function useAllFollowUps() {
    return useQuery({
        queryKey: ['followups'], 
        queryFn: getAllFollowUps 
    });
}

export function useFollowUpsByOpportunityId(idOpportunity: number) {
    return useQuery({
        queryKey: ['followupsId', idOpportunity],
        queryFn: async () =>{
            const data = await getAllFollowUps();
            return data.filter((followUp: FollowUp) => followUp.opportunityId === idOpportunity);
        },
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