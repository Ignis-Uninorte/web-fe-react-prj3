import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiManager from '../services/api';
import { getAllOpportunities, deleteOpportunityById } from '../services/opportunities.services';
import { Opportunity } from '../types/opportunities.type';

// Obtener todas las oportunidades
export function useAllOpportunities() {
    return useQuery({
        queryKey: ['opportunities'],
        queryFn: getAllOpportunities,
    });
}

// Eliminar una oportunidad
export function useDeleteOpportunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteOpportunityById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        },
    });
}

// Obtener todos los clientes
export function useClients() {
    return useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const response = await apiManager.get('/clients');
            return response.data;
        },
    });
}

// Obtener datos de una oportunidad específica
export function useOpportunity(opportunityId: string | undefined) {
    return useQuery({
        queryKey: ['opportunity', opportunityId],
        queryFn: async () => {
            if (!opportunityId) return null;
            const response = await apiManager.get(`/opportunities/${opportunityId}`);
            return response.data;
        },
        enabled: !!opportunityId,
    });
}

// Crear una nueva oportunidad
export function useCreateOpportunity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newOpportunity: Opportunity) => {
            const response = await apiManager.post('/opportunities', newOpportunity);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        },
    });
}

// Actualizar una oportunidad existente
export function useUpdateOpportunity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ opportunityId, updatedOpportunity }: { opportunityId: string; updatedOpportunity: Opportunity }) => {
            const response = await apiManager.put(`/opportunities/${opportunityId}`, updatedOpportunity);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        },
    });
}
