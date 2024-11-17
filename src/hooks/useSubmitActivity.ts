import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityFormInputs } from '../pages/moduleActivity/components/CreateActivity'; // Adjust the import path as necessary

const API_URL = 'https://three-web-be-json-server-api-ignis.onrender.com/activities';

// Define the return type of the response
interface Activity {
    id: number;
    contactType: string;
    contactDate: string;
    clientContact: string;
    description: string;
}

// Define the hook for submitting an activity
export const useSubmitActivity = () => {
    const queryClient = useQueryClient();

    // The mutation function should be an async function that returns the created activity
    const submitActivity = async (newActivity: ActivityFormInputs): Promise<Activity> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newActivity),
        });

        if (!response.ok) {
            throw new Error('Failed to create activity');
        }

        return response.json() as Promise<Activity>; // Type the response as `Activity`
    };

    return useMutation<Activity, Error, ActivityFormInputs>({
        mutationFn: submitActivity,
        onSuccess: (data) => {
            // Invalidate the query for 'activities'
            queryClient.invalidateQueries({ queryKey: ['activities'] }); // Standard query key type

            // Optionally, refetch the activities or update the query data with the new activity
            queryClient.setQueryData(['activities'], (oldData: Activity[] | undefined) => {
                // Ensure oldData is typed as Activity[] and handle undefined case
                return oldData ? [...oldData, data] : [data];
            });
        },
        onError: (error: Error) => {
            console.error('Error creating activity:', error);
        },
    });
};
