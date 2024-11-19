// import React, { useEffect, useState } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { useAllOpportunities } from '../../../hooks/useOpportunities'; // Usamos el hook de oportunidades
// import { useSubmitActivity } from '../../../hooks/useSubmitActivity';
// import '../../../styles/CreateActivity.css';
// import { useFetchActivities } from '../../../hooks/useFetchActivities'; // Importamos la interfaz desde el hook
// import MainLayout from '../../../layouts/MainLayout';
// import back from '../../../assets/back-arrow.svg';


// export interface ActivityFormInputs {
//     id?: number;
//     opportunityId: number; // Añadimos el campo opportunityId
//     contactType: string;
//     contactDate: string;
//     clientContact: string;
//     commercialExecutive: string;
//     description: string;
// }

// interface Opportunity {
//     Id: string;  // El Id de la oportunidad, ajusta el tipo si es necesario
//     businessName: string;
// }

// interface CreateActivityProps {
//     onClose: () => void;
// }

// const CreateActivity: React.FC<CreateActivityProps> = ({ onClose }) => {
//     const { register, handleSubmit, formState: { errors }, reset } = useForm<ActivityFormInputs>();
//     const [newId, setNewId] = useState<number | null>(null);
//     const { data: activities, isLoading: activitiesLoading, isError: activitiesError } = useFetchActivities(); // Usamos el hook actualizado
//     const { data: opportunities, isLoading: opportunitiesLoading, isError: opportunitiesError } = useAllOpportunities(); // Usamos el hook de oportunidades
//     const { mutateAsync: submitActivity, isError: isSubmitError, isSuccess } = useSubmitActivity();

//     // Calcular el ID más alto entre las actividades existentes
//     useEffect(() => {
//         if (activities && activities.length > 0) {
//             const highestId = activities.reduce((max, activity) => Math.max(max, activity.id), 0);
//             setNewId(highestId + 1);
//         } else {
//             setNewId(1); // Si no hay actividades, iniciamos en 1
//         }
//     }, [activities]);

//     const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
//         if (newId === null) {
//             console.error('Failed to generate unique ID');
//             return;
//         }

//         const activityWithNewId = { ...data, id: newId };

//         try {
//             await submitActivity(activityWithNewId);
//             reset(); // Limpiar el formulario después del envío
//             onClose(); // Cerrar el modal
//         } catch (error) {
//             console.error('Error creating activity:', error);
//         }
//     };

//     if (activitiesLoading || opportunitiesLoading) return <p>Loading...</p>;
//     if (activitiesError || opportunitiesError) return <p>Failed to load data.</p>;

//     return (
//         <MainLayout>
//             <div className="create-activity-form container">
//                 <div className="back">
//                     <div className="back-arrow">
//                         <button onClick={() => window.history.back()} className="back-btn">
//                             <img src={back} alt="Back" />
//                         </button>
//                     </div>
//                 </div>
//                 <h2>Create Follow-up Activity</h2>
//                 {isSuccess && <div className="success-message">Activity successfully created!</div>}
//                 {isSubmitError && <div className="error-message">Error creating activity. Please try again.</div>}
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="form-group">
//                         <label>Opportunity:</label>
//                         <select {...register('opportunityId', { required: 'Opportunity is required' })}>
//                             <option value="">Select Opportunity</option>
//                             {opportunities?.map((opportunity: Opportunity) => (
//                                 <option key={opportunity.Id} value={opportunity.Id}>
//                                     {opportunity.businessName}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.opportunityId && <span className="error">{errors.opportunityId.message}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>Contact Type:</label>
//                         <select {...register('contactType', { required: 'Contact type is required' })}>
//                             <option value="">Select</option>
//                             <option value="Call">Call</option>
//                             <option value="Email">Email</option>
//                             <option value="In-person Meeting">In-person Meeting</option>
//                         </select>
//                         {errors.contactType && <span className="error">{errors.contactType.message}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>Contact Date:</label>
//                         <input type="date" {...register('contactDate', { required: 'Contact date is required' })} />
//                         {errors.contactDate && <span className="error">{errors.contactDate.message}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>Client Contact:</label>
//                         <select {...register('clientContact', { required: 'Client contact is required' })}>
//                             <option value="">Select Contact</option>
//                             {activities?.map((activity) => (
//                                 <option key={activity.id} value={activity.clientContact}>
//                                     {activity.clientContact}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.clientContact && <span className="error">{errors.clientContact.message}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>Commercial Executive:</label>
//                         <input
//                             type="text"
//                             {...register('commercialExecutive', { required: 'Commercial Executive is required' })}
//                         />
//                         {errors.commercialExecutive && <span className="error">{errors.commercialExecutive.message}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label>Description:</label>
//                         <textarea {...register('description', { required: 'Description is required' })} />
//                         {errors.description && <span className="error">{errors.description.message}</span>}
//                     </div>

//                     <div className="form-buttons">
//                         <button onClick={() => window.history.back()} type="button" className="cancel-btn">
//                             Cancel
//                         </button>
//                         <button type="submit" className="submit-btn">
//                             Save
//                         </button>
//                     </div>
//                 </form>
//             </div>

//         </MainLayout>
//     );
// };

// export default CreateActivity;



import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAllOpportunities } from '../../../hooks/useOpportunities';
import { useSubmitActivity } from '../../../hooks/useSubmitActivity';
import { useUpdateActivity } from '../../../hooks/useUpdateActivity'; // Nuevo hook para actualizar
import '../../../styles/CreateActivity.css';
import { useFetchActivities } from '../../../hooks/useFetchActivities';
import MainLayout from '../../../layouts/MainLayout';
import back from '../../../assets/back-arrow.svg';

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
    activityId?: number; // Nuevo prop para identificar si está en modo edición
    onClose: () => void;
}

const CreateActivity: React.FC<CreateActivityProps> = ({ activityId, onClose }) => {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ActivityFormInputs>();
    const { data: activities } = useFetchActivities();
    const { data: opportunities, isLoading: opportunitiesLoading } = useAllOpportunities();
    const { mutateAsync: submitActivity, isError: isSubmitError, isSuccess: isSubmitSuccess } = useSubmitActivity();
    const { mutateAsync: updateActivity, isError: isUpdateError, isSuccess: isUpdateSuccess } = useUpdateActivity();

    const [isEditing, setIsEditing] = useState(false);

    // Cargar los datos de la actividad en modo edición
    useEffect(() => {
        if (activityId && activities) {
            const activityToEdit = activities.find(activity => activity.id === activityId);
            if (activityToEdit) {
                setIsEditing(true);
                Object.entries(activityToEdit).forEach(([key, value]) => {
                    setValue(key as keyof ActivityFormInputs, value);
                });
            }
        }
    }, [activityId, activities, setValue]);

    const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
        try {
            if (isEditing) {
                await updateActivity({ id: activityId!, ...data });
            } else {
                await submitActivity(data);
            }
            reset();
            onClose();
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

    if (opportunitiesLoading) return <p>Loading opportunities...</p>;

    return (
        <MainLayout>
            <div className="create-activity-form container">
                <div className="back">
                    <div className="back-arrow">
                        <button onClick={() => window.history.back()} className="back-btn">
                            <img src={back} alt="Back" />
                        </button>
                    </div>
                </div>
                <h2>{isEditing ? 'Update Follow-up Activity' : 'Create Follow-up Activity'}</h2>
                {(isSubmitError || isUpdateError) && <div className="error-message">Error saving activity. Please try again.</div>}
                {(isSubmitSuccess || isUpdateSuccess) && <div className="success-message">Activity successfully saved!</div>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Opportunity:</label>
                        <select {...register('opportunityId', { required: 'Opportunity is required' })} disabled={isEditing}>
                            <option value="">Select Opportunity</option>
                            {opportunities?.map((opportunity: Opportunity) => (
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
                        <input type="date" {...register('contactDate', { required: 'Contact date is required' })} />
                        {errors.contactDate && <span className="error">{errors.contactDate.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Client Contact:</label>
                        <select {...register('clientContact', { required: 'Client contact is required' })}>
                            <option value="">Select Contact</option>
                            {activities?.map(activity => (
                                <option key={activity.id} value={activity.clientContact}>
                                    {activity.clientContact}
                                </option>
                            ))}
                        </select>
                        {errors.clientContact && <span className="error">{errors.clientContact.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Commercial Executive:</label>
                        <input type="text" {...register('commercialExecutive', { required: 'Commercial Executive is required' })} />
                        {errors.commercialExecutive && <span className="error">{errors.commercialExecutive.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea {...register('description', { required: 'Description is required' })} />
                        {errors.description && <span className="error">{errors.description.message}</span>}
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            {isEditing ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateActivity;
