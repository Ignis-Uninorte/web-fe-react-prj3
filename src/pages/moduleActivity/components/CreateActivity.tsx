import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSubmitActivity } from '../../../hooks/useSubmitActivity';
import { useUpdateActivity } from '../../../hooks/useUpdateActivity';
import { useFetchActivities } from '../../../hooks/useFetchActivities';
import { useAllOpportunities } from '../../../hooks/useOpportunities';
import '../../../styles/CreateActivity.css';
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

const CreateActivity: React.FC = () => {
    const { activityId } = useParams<{ activityId: string }>();
    const { pathname } = useLocation();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ActivityFormInputs>();
    const navigate = useNavigate();

    const { data: activities } = useFetchActivities();
    const { data: opportunities, isLoading: opportunitiesLoading } = useAllOpportunities();
    const { mutateAsync: submitActivity, isError: isSubmitError, isSuccess: isSubmitSuccess } = useSubmitActivity();
    const { mutateAsync: updateActivity, isError: isUpdateError, isSuccess: isUpdateSuccess } = useUpdateActivity();

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (activityId && activities) {
            const activityToEdit = activities.find(activity => activity.id === parseInt(activityId, 10));
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
                await updateActivity({ id: parseInt(activityId!, 10), ...data });
            } else {
                await submitActivity(data);
            }
            reset();
            setTimeout(() => navigate('/seguimiento'), 2000);
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

    if (opportunitiesLoading) return <p>Cargando oportunidades...</p>;

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
                <h2>{isEditing ? 'Actualizar Actividad de Seguimiento' : 'Crear Actividad de Seguimiento'}</h2>
                {(isSubmitError || isUpdateError) && (
                    <div className="error-message">Error guardando la actividad. Intenta de nuevo.</div>
                )}
                {(isSubmitSuccess || isUpdateSuccess) && (
                    <div className="success-message">¡Actividad guardada con éxito! Redirigiendo en 2 segundos...</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Oportunidad:</label>
                        <select {...register('opportunityId', { required: 'Oportunidad es requerida' })} disabled={isEditing}>
                            <option value="">Selecciona una oportunidad</option>
                            {opportunities?.map((opportunity: Opportunity) => (
                                <option key={opportunity.Id} value={opportunity.Id}>
                                    {opportunity.businessName}
                                </option>
                            ))}
                        </select>
                        {errors.opportunityId && <span className="error">{errors.opportunityId.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Tipo de Contacto:</label>
                        <select {...register('contactType', { required: 'Tipo de contacto es requerido' })}>
                            <option value="">Seleccionar</option>
                            <option value="Call">Llamada</option>
                            <option value="Email">Correo</option>
                            <option value="In-person Meeting">Reunión</option>
                        </select>
                        {errors.contactType && <span className="error">{errors.contactType.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Fecha de Contacto:</label>
                        <input type="date" {...register('contactDate', { required: 'Fecha de contacto es requerida' })} />
                        {errors.contactDate && <span className="error">{errors.contactDate.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Contacto del Cliente:</label>
                        <input type="text" {...register('clientContact', { required: 'Contacto del cliente es requerido' })} />
                        {errors.clientContact && <span className="error">{errors.clientContact.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Ejecutivo Comercial:</label>
                        <input type="text" {...register('commercialExecutive', { required: 'Ejecutivo comercial es requerido' })} />
                        {errors.commercialExecutive && <span className="error">{errors.commercialExecutive.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Descripción:</label>
                        <textarea {...register('description', { required: 'Descripción es requerida' })} />
                        {errors.description && <span className="error">{errors.description.message}</span>}
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/seguimiento')}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-btn">
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateActivity;
