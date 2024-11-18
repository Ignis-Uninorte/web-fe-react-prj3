import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useFetchActivities } from '../../../hooks/useFetchActivities'; // Importamos el hook correcto
import { useSubmitActivity } from '../../../hooks/useSubmitActivity';
import '../../../styles/CreateActivity.css';
import { Activity } from '../../../hooks/useFetchActivities'; // Importamos la interfaz desde el hook

export interface ActivityFormInputs {
    id?: number;
    contactType: string;
    contactDate: string;
    clientContact: string;
    commercialExecutive: string;
    description: string;
}

interface CreateActivityProps {
    onClose: () => void;
}

const CreateActivity: React.FC<CreateActivityProps> = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ActivityFormInputs>();
    const [newId, setNewId] = useState<number | null>(null);
    const { data: activities, isLoading, isError } = useFetchActivities(); // Usamos el hook actualizado
    const { mutateAsync: submitActivity, isError: isSubmitError, isSuccess } = useSubmitActivity();

    // Calcular el ID más alto entre las actividades existentes
    useEffect(() => {
        if (activities && activities.length > 0) {
            const highestId = activities.reduce((max, activity) => Math.max(max, activity.id), 0);
            setNewId(highestId + 1);
        } else {
            setNewId(1); // Si no hay actividades, iniciamos en 1
        }
    }, [activities]);

    const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
        if (newId === null) {
            console.error('Failed to generate unique ID');
            return;
        }

        const activityWithNewId = { ...data, id: newId };

        try {
            await submitActivity(activityWithNewId);
            reset(); // Limpiar el formulario después del envío
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    };

    if (isLoading) return <p>Loading activities...</p>;
    if (isError) return <p>Failed to load activities.</p>;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>Create Follow-up Activity</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Contact Type:</label>
                        <select {...register('contactType', { required: 'Contact type is required' })}>
                            <option value="">Select</option>
                            <option value="Call">Call</option>
                            <option value="Email">Email</option>
                            <option value="In-person Meeting">In-person Meeting</option>
                        </select>
                        {errors.contactType && <span className="error">{errors.contactType.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Contact Date:</label>
                        <input
                            type="date"
                            {...register('contactDate', { required: 'Contact date is required' })}
                        />
                        {errors.contactDate && <span className="error">{errors.contactDate.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Client Contact:</label>
                        <select {...register('clientContact', { required: 'Client contact is required' })}>
                            <option value="">Select Contact</option>
                            {activities?.map((activity) => (
                                <option key={activity.id} value={activity.clientContact}>
                                    {activity.clientContact}
                                </option>
                            ))}
                        </select>
                        {errors.clientContact && <span className="error">{errors.clientContact.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Commercial Executive:</label>
                        <input
                            type="text"
                            {...register('commercialExecutive', { required: 'Commercial Executive is required' })}
                        />
                        {errors.commercialExecutive && <span className="error">{errors.commercialExecutive.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <span className="error">{errors.description.message}</span>}
                    </div>

                    {isSubmitError && <div className="error-message">Error creating activity. Please try again.</div>}
                    {isSuccess && <div className="success-message">Activity successfully created!</div>}

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={newId === null}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateActivity;
