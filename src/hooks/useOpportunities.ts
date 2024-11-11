import { useQuery} from '@tanstack/react-query';
import { getAllOpportunities,  } from '../services/opportunities.services';

export function useAllOpportunities() {
    return useQuery({
        queryKey: ['opprtunities'], 
        queryFn: getAllOpportunities 
    });
}
