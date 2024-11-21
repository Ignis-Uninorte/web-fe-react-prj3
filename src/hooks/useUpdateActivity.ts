import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiManager from '../services/api'; // Asegúrate de que este es tu gestor de API configurado

export function useUpdateActivity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (activity: { id: number; [key: string]: any }) => {
            const { id, ...updatedData } = activity;
            const response = await apiManager.put(`/activities/${id}`, updatedData);
            return response.data;
        },
        onSuccess: () => {
            // Invalidar las actividades para que se actualicen automáticamente
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
        onError: (error) => {
            console.error('Error updating activity:', error);
        },
    });
}
