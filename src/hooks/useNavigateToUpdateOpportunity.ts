// src/hooks/useNavigateToUpdateOpportunity.ts
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../types/opportunities.type';

export function useNavigateToUpdateOpportunity() {
    const navigate = useNavigate();

    const navigateToUpdate = (opportunity: Opportunity) => {
        navigate(`/opportunity/update/${opportunity.Id}`);
    };

    return { navigateToUpdate };
}
