import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useClients, useOpportunity, useCreateOpportunity, useUpdateOpportunity, useAllOpportunities } from '../../../hooks/useOpportunities';
import back from '../../../assets/back-arrow.svg';
import '../../../styles/CreateOpportunity.css';
import { Opportunity } from '../../../types/opportunities.type';

interface OpportunityFormInputs {
    Id?: string;
    clientId: string;
    businessName: string;
    businessLine: string;
    description: string;
    estimatedValue: string;
    estimatedDate: string;
    status: string;
}

const OpportunityForm: React.FC = () => {
    const { opportunityId } = useParams<{ opportunityId: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<OpportunityFormInputs>();
    const [message, setMessage] = useState<string | null>(null);

    const { data: clients, isLoading: clientsLoading } = useClients();
    const { data: opportunity, isLoading: opportunityLoading } = useOpportunity(opportunityId);
    const { data: opportunities } = useAllOpportunities();

    const createOpportunity = useCreateOpportunity();
    const updateOpportunity = useUpdateOpportunity();

    const isEditMode = !!opportunityId;

    useEffect(() => {
        if (opportunity) {
            reset({
                ...opportunity,
                estimatedValue: opportunity.estimatedValue.toString(),
            });
        }
    }, [opportunity, reset]);


    const getNextOpportunityId = (): string => {
        if (!opportunities?.length) {
            return '1';
        }

        const lastId = opportunities
            .map((opp: Opportunity) => parseInt(opp.Id, 10))
            .filter((id: number) => !isNaN(id))
            .sort((a: number, b: number) => b - a)[0];

        return (lastId + 1).toString();
    };

    const onSubmit: SubmitHandler<OpportunityFormInputs> = (data) => {
        const formattedData = {
            ...data,
            Id: data.Id || getNextOpportunityId(),
        };

        if (isEditMode && opportunityId) {
            updateOpportunity.mutate(
                { opportunityId, updatedOpportunity: formattedData },
                {
                    onSuccess: () => {
                        setMessage('¡Oportunidad actualizada con éxito!');
                        setTimeout(() => navigate('/oportunidades'), 2000);
                    },
                    onError: () => {
                        setMessage('Error al actualizar la oportunidad.');
                    },
                }
            );
        } else {
            createOpportunity.mutate(
                { ...formattedData, status: 'Apertura' },
                {
                    onSuccess: () => {
                        setMessage('¡Oportunidad creada con éxito! Redirigiendo en 2 segundos');
                        reset();
                        setTimeout(() => navigate('/oportunidades'), 2000);
                    },
                    onError: () => {
                        setMessage('Error al crear la oportunidad.');
                    },
                }
            );
        }
    };

    return (
        <MainLayout>
            <div className="create-opportunity-form container">
                <div className="back">
                    <div className="back-arrow">
                        <button onClick={() => window.history.back()} className="back-btn">
                            <img src={back} alt="Back" />
                        </button>
                    </div>
                </div>
                <h2>{isEditMode ? 'Actualizar Oportunidad' : 'Crear Nueva Oportunidad'}</h2>
                {message && <div className="notification">{message}</div>}
                {(clientsLoading || opportunityLoading) && <p>Cargando datos...</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Cliente:</label>
                        <select
                            {...register('clientId', { required: 'El cliente es obligatorio' })}
                            disabled={isEditMode} // Disable if editing
                        >
                            <option value="">Seleccione un cliente</option>
                            {clients?.map((client: { id: number; name: string }) => (
                                <option key={client.id} value={client.id.toString()}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                        {errors.clientId && <span className="error">{errors.clientId.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Nombre de Negocio:</label>
                        <input type="text" {...register('businessName', { required: 'Nombre de negocio es obligatorio' })} />
                        {errors.businessName && <span className="error">{errors.businessName.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Línea de Negocio:</label>
                        <select {...register('businessLine', { required: 'Línea de negocio es obligatoria' })}>
                            <option value="">Seleccione la línea de negocio</option>
                            <option value="outsourcing recursos">Outsourcing Recursos</option>
                            <option value="desarrollo web">Desarrollo Web</option>
                            <option value="desarrollo mobile">Desarrollo Mobile</option>
                            <option value="consultoría TI">Consultoría TI</option>
                        </select>
                        {errors.businessLine && <span className="error">{errors.businessLine.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Descripción de la Oportunidad:</label>
                        <textarea {...register('description', { required: 'La descripción es obligatoria' })} />
                        {errors.description && <span className="error">{errors.description.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Valor Estimado (COP):</label>
                        <input type="number" {...register('estimatedValue', { required: 'Valor estimado es obligatorio' })} />
                        {errors.estimatedValue && <span className="error">{errors.estimatedValue.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Fecha Estimada:</label>
                        <input type="date" {...register('estimatedDate', { required: 'Fecha estimada es obligatoria' })} />
                        {errors.estimatedDate && <span className="error">{errors.estimatedDate.message}</span>}
                    </div>

                    <div className="form-group">
                        {isEditMode ? (
                            <>
                                <label>Estado:</label>
                                <select {...register('status', { required: 'El estado es obligatorio' })}>
                                    <option value="">Seleccione el estado</option>
                                    <option value="Apertura">Apertura</option>
                                    <option value="En Estudio">En Estudio</option>
                                    <option value="Orden de Compra">Orden de Compra</option>
                                    <option value="Finalizada">Finalizada</option>
                                </select>
                                {errors.status && <span className="error">{errors.status.message}</span>}
                            </>
                        ) : (
                            <input
                                type="hidden"
                                value="Apertura"
                                {...register('status', { required: 'El estado es obligatorio' })}
                            />
                        )}
                    </div>

                    <button type="submit" className="submit-btn">
                        {isEditMode ? 'Guardar Cambios' : 'Guardar Oportunidad'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default OpportunityForm;
