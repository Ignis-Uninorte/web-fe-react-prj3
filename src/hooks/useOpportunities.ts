import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { getAllOpportunities, deleteOpportunityById } from '../services/opportunities.services';

export function useAllOpportunities() {
    return useQuery({
        queryKey: ['opprtunities'], 
        queryFn: getAllOpportunities 
    });
}
export function useDeleteOpportunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteOpportunityById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        },
    });
}