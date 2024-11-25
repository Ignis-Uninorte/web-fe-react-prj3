import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSubmitActivity } from '../../../hooks/useSubmitActivity';
import { useUpdateActivity } from '../../../hooks/useUpdateActivity';
import { useFetchContactsFromClients } from '../../../hooks/useFetchContactsFromClients';
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

interface CreateActivityProps {
    onClose: () => void;
    activityToEdit?: ActivityFormInputs | null;
}

const CreateActivity: React.FC<CreateActivityProps> = ({ onClose, activityToEdit }) => {
    const { opportunityId } = useParams<{ opportunityId: string }>();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ActivityFormInputs>();

    // Llamamos al hook para obtener los contactos del cliente
    const { data: clientContacts, isLoading, isError } = useFetchContactsFromClients(opportunityId);

    const { mutateAsync: submitActivity, isError: isSubmitError, isSuccess: isSubmitSuccess } = useSubmitActivity();
    const { mutateAsync: updateActivity, isError: isUpdateError, isSuccess: isUpdateSuccess } = useUpdateActivity();

    useEffect(() => {
        if (opportunityId) {
            setValue('opportunityId', parseInt(opportunityId, 10));
        }
        if (activityToEdit) {
            setValue('id', activityToEdit.id ?? 0);
            setValue('contactType', activityToEdit.contactType);
            setValue('contactDate', activityToEdit.contactDate);
            setValue('clientContact', activityToEdit.clientContact);
            setValue('commercialExecutive', activityToEdit.commercialExecutive);
            setValue('description', activityToEdit.description);
        }
    }, [opportunityId, activityToEdit, setValue]);

    const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
        try {
            if (activityToEdit && activityToEdit.id !== undefined) {
                await updateActivity({ ...data, id: activityToEdit.id });
            } else {
                await submitActivity(data);
            }
            reset();
            onClose();
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

    return (
        <div className="create-activity-modal">
            <h2>{activityToEdit ? 'Actualizar Actividad de Seguimiento' : 'Crear Actividad de Seguimiento'}</h2>
            {(isSubmitError || isUpdateError) && (
                <div className="error-message">Error guardando la actividad. Intenta de nuevo.</div>
            )}
            {(isSubmitSuccess || isUpdateSuccess) && (
                <div className="success-message">¡Actividad {activityToEdit ? 'actualizada' : 'guardada'} con éxito!</div>
            )}
            {isLoading && <div>Cargando contactos...</div>}
            {isError && <div>Error al cargar los contactos.</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('opportunityId', { required: true })} />
                {activityToEdit && activityToEdit.id !== undefined && <input type="hidden" value={activityToEdit.id} {...register('id', { valueAsNumber: true })} />}

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
                    {isLoading ? (
                        <div>Cargando contactos...</div>
                    ) : isError ? (
                        <div>Error al cargar los contactos.</div>
                    ) : (
                        <select {...register('clientContact', { required: 'Contacto del cliente es requerido' })}>
                            <option value="">Seleccionar</option>
                            {clientContacts?.map((contact) => (
                                <option key={contact.email} value={contact.email}>
                                    {contact.name} {contact.lastName}
                                </option>
                            ))}
                        </select>
                    )}
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
                    <button onClick={onClose} type="button" className="cancel-btn">
                        Cancelar
                    </button>
                    <button type="submit" className="submit-btn">{activityToEdit ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        </div>
    );
};

export default CreateActivity;
