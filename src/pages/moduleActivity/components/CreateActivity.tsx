import React, { useEffect, useState } from 'react';
import '../../../styles/CreateActivity.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useFetchActivities } from '../../../hooks/useFetchActivities';
import { useFetchContacts } from '../../../hooks/useFetchContacts';
import { useSubmitActivity } from '../../../hooks/useSubmitActivity';

// Export the interface so it can be used in other files
export interface ActivityFormInputs {
    id?: number;
    contactType: string;
    contactDate: string;
    clientContact: string;
    description: string;
}

interface CreateActivityProps {
    onClose: () => void;
}

const CreateActivity: React.FC<CreateActivityProps> = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ActivityFormInputs>();
    const [newId, setNewId] = useState<number | null>(null);
    const { data: activities } = useFetchActivities();
    const { data: contacts } = useFetchContacts();
    const { mutateAsync: submitActivity, isError } = useSubmitActivity();

    useEffect(() => {
        if (activities) {
            const highestId = activities.reduce((max, activity) => Math.max(max, activity.id || 0), 0);
            setNewId(highestId + 1);
        }
    }, [activities]);

    const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
        if (newId === null) {
            console.error('Failed to generate unique ID');
            return;
        }

        const activityWithId = { ...data, id: newId };
        try {
            await submitActivity(activityWithId);
            reset();
            onClose();
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    };

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
                            {contacts?.map(contact => (
                                <option key={contact.id} value={contact.id}>{contact.name}</option>
                            ))}
                        </select>
                        {errors.clientContact && <span className="error">{errors.clientContact.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea 
                            {...register('description', { required: 'Description is required' })} 
                        />
                        {errors.description && <span className="error">{errors.description.message}</span>}
                    </div>

                    {isError && <div className="error-message">Error creating activity. Please try again.</div>}

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={!newId}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateActivity;
