import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubmitActivity } from '../../../hooks/useSubmitActivity';
import { useFetchContactsFromClients } from '../../../hooks/useFetchContactsFromClients'; // Importamos el hook
import '../../../styles/CreateActivity.css';
import MainLayout from '../../../layouts/MainLayout';
import back from '../../../assets/back-arrow.svg';

export interface ActivityFormInputs {
    opportunityId: number;
    contactType: string;
    contactDate: string;
    clientContact: string;
    commercialExecutive: string;
    description: string;
}

const CreateActivity: React.FC = () => {
    const { opportunityId } = useParams<{ opportunityId: string }>();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ActivityFormInputs>();
    const navigate = useNavigate();

    // Llamamos al hook para obtener los contactos del cliente
    const { data: clientContacts, isLoading, isError } = useFetchContactsFromClients(opportunityId);

    const { mutateAsync: submitActivity, isError: isSubmitError, isSuccess: isSubmitSuccess } = useSubmitActivity();

    useEffect(() => {
        if (opportunityId) {
            setValue('opportunityId', parseInt(opportunityId, 10));
        }
    }, [opportunityId, setValue]);

    const onSubmit: SubmitHandler<ActivityFormInputs> = async (data) => {
        try {
            await submitActivity(data);
            reset();
            setTimeout(() => navigate(`/opportunity/${opportunityId}`), 2000);
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

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
                <h2>Crear Actividad de Seguimiento</h2>
                {isSubmitError && (
                    <div className="error-message">Error guardando la actividad. Intenta de nuevo.</div>
                )}
                {isSubmitSuccess && (
                    <div className="success-message">¡Actividad guardada con éxito! Redirigiendo en 2 segundos...</div>
                )}
                {isLoading && <div>Loading contacts...</div>}
                {isError && <div>Error al cargar los contactos.</div>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register('opportunityId', { required: true })} />

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
                        <button onClick={() => window.history.back()} type="button" className="cancel-btn">
                            Cancelar
                        </button>
                        <button type="submit" className="submit-btn">Guardar</button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateActivity;
