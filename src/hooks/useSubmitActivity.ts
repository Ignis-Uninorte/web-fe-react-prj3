import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowUp} from '../types/followup.type'; 
import { ActivityFormInputs } from '../pages/moduleActivity/components/CreateActivity'; // Ajusta la ruta de importación si es necesario

const API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/activities';


export const useSubmitActivity = () => {
    const queryClient = useQueryClient();
    const submitActivity = async (newActivity: ActivityFormInputs): Promise<FollowUp> => {
        console.log('Enviando actividad:', newActivity);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                opportunityId: newActivity.opportunityId,
                contactType: newActivity.contactType,
                contactDate: newActivity.contactDate,
                clientContact: newActivity.clientContact,
                commercialExecutive: newActivity.commercialExecutive,
                description: newActivity.description,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de respuesta:', errorData);
            throw new Error(`Error al crear la actividad: ${errorData.error || 'Desconocido'}`);
        }

        const responseData = await response.json();
        console.log('Respuesta de la API:', responseData);

        if (!responseData.id) {
            throw new Error('La respuesta de la actividad no contiene un ID válido');
        }

        return responseData;
    };


    return useMutation<FollowUp, Error, ActivityFormInputs>({
        mutationFn: submitActivity,
        onSuccess: (data) => {
            console.log('Actividad creada con éxito:', data); // Depuración: muestra los datos de la actividad creada

            // Invalida la consulta para 'activities' y actualiza la caché
            queryClient.invalidateQueries({ queryKey: ['activities'] });

            // Actualiza los datos de la consulta con la nueva actividad
            queryClient.setQueryData(['activities'], (oldData: FollowUp[] | undefined) => {
                return oldData ? [...oldData, data] : [data];
            });
        },
        onError: (error: Error) => {
            console.error('Error al crear la actividad:', error); // Muestra el error completo
        },
    });
};
