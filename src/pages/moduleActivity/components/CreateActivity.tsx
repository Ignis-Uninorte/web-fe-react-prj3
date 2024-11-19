import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import '../../../styles/CreateActivity.css';

export interface ActivityFormInputs {
    id?: number;
    opportunityId: number;
    contactType: string;
    contactDate: string;
    clientContact: string;
    commercialExecutive: string;
    description: string;
}

interface Opportunity {
    Id: string;
    businessName: string;
}

interface CreateActivityProps {
    onClose: () => void;
    activityId?: number; // Recibe el ID de la actividad a actualizar (opcional)
}

const CreateActivity: React.FC<CreateActivityProps> = ({ onClose, activityId }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ActivityFormInputs>();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Obtener todas las oportunidades
        const fetchOpportunities = async () => {
            try {
                const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/opportunities');
                const data = await response.json();
                setOpportunities(data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            }
        };

        fetchOpportunities();

        // Si activityId existe, obtener los datos de la actividad
        if (activityId) {
            const fetchActivity = async () => {
                try {
                    const response = await fetch(`https://three-web-be-json-server-api-ignis.onrender.com/activities/${activityId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch activity');
                    }
                    const activity = await response.json();
                    // Prellenar los campos del formulario con los datos de la actividad
                    Object.keys(activity).forEach((key) => {
                        setValue(key as keyof ActivityFormInputs, activity[key]);
                    });
                } catch (error) {
                    console.error('Error fetching activity:', error);
                    setErrorMessage('Error loading activity data.');
                }
            };

            fetchActivity();
        }
    }, [activityId, setValue]);

    const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
        try {
            const url = activityId
                ? `https://three-web-be-json-server-api-ignis.onrender.com/activities/${activityId}` // Si es actualización
                : 'https://three-web-be-json-server-api-ignis.onrender.com/activities'; // Si es creación

            const method = activityId ? 'PUT' : 'POST'; // Método según la operación
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit activity');
            }

            reset(); // Limpiar formulario
            onClose(); // Cerrar modal
        } catch (error) {
            console.error('Error submitting activity:', error);
            setErrorMessage('Error submitting activity. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>{activityId ? 'Update Follow-up Activity' : 'Create Follow-up Activity'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Opportunity:</label>
                        <select {...register('opportunityId', { required: 'Opportunity is required' })} disabled={!!activityId}>
                            <option value="">Select Opportunity</option>
                            {opportunities.map((opportunity: Opportunity) => (
                                <option key={opportunity.Id} value={opportunity.Id}>
                                    {opportunity.businessName}
                                </option>
                            ))}
                        </select>
                        {errors.opportunityId && <span className="error">{errors.opportunityId.message}</span>}
                    </div>

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
                        <input
                            type="text"
                            {...register('clientContact', { required: 'Client contact is required' })}
                        />
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

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateActivity;

