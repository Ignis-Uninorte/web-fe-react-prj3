import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityFormInputs } from '../pages/moduleActivity/components/CreateActivity'; // Ajusta la ruta de importación si es necesario

const API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/activities';

// Define el tipo de la respuesta
interface Activity {
    id: number;
    opportunityId: number;  // Se añade el campo opportunityId
    contactType: string;
    contactDate: string;
    clientContact: string;
    description: string;
}

// Define el hook para enviar la actividad
export const useSubmitActivity = () => {
    const queryClient = useQueryClient();

    // La función de mutación debería ser una función asincrónica que devuelve la actividad creada
    // Manejo de errores mejorado
    const submitActivity = async (newActivity: ActivityFormInputs): Promise<Activity> => {
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
        console.log('Respuesta de la API:', responseData); // Añadir esta línea para ver los datos de la respuesta

        if (!responseData.id) {
            throw new Error('La respuesta de la actividad no contiene un ID válido');
        }

        return responseData;
    };


    return useMutation<Activity, Error, ActivityFormInputs>({
        mutationFn: submitActivity,
        onSuccess: (data) => {
            console.log('Actividad creada con éxito:', data); // Depuración: muestra los datos de la actividad creada

            // Invalida la consulta para 'activities' y actualiza la caché
            queryClient.invalidateQueries({ queryKey: ['activities'] });

            // Actualiza los datos de la consulta con la nueva actividad
            queryClient.setQueryData(['activities'], (oldData: Activity[] | undefined) => {
                return oldData ? [...oldData, data] : [data];
            });
        },
        onError: (error: Error) => {
            console.error('Error al crear la actividad:', error); // Muestra el error completo
        },
    });
};
