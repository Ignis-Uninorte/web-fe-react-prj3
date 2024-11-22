import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useAllOpportunities } from '../../../hooks/useOpportunities';
import { useAllClients } from '../../../hooks/useClients';
import { Opportunity } from '../../../types/opportunities.type';
import { Client } from '../../../types/clientes.type';
import back from '../../../assets/back-arrow.svg';
import '../../../styles/OpportunityDetail.css';
import FollowUpTable from '../../components/followupTable';

const OpportunityDetail: React.FC = () => {
    const { opportunityId } = useParams<{ opportunityId: string }>();
    const { data: opportunitiesData, isLoading: oppLoading, error: oppError } = useAllOpportunities();
    const { data: clientsData, isLoading: clientLoading, error: clientError } = useAllClients();

    // Get the current opportunity
    const opportunityData = useMemo(() => {
        if (!opportunitiesData || !opportunityId) return undefined;
        return opportunitiesData.find((opp: Opportunity) => opp.Id === opportunityId);
    }, [opportunitiesData, opportunityId]);

    // Get the related client using the clientId from the opportunity
    const relatedClient = useMemo(() => {
        if (!clientsData || !opportunityData) return undefined;
        return clientsData.find((client: Client) => client.id === Number(opportunityData.clientId));
    }, [clientsData, opportunityData]);

    if (oppLoading || clientLoading) return <p>Loading...</p>;
    if (oppError || clientError) return <p className="error-message">Error: {oppError?.message || clientError?.message}</p>;
    if (!opportunityData) return <p>No opportunity data available for ID "{opportunityId}".</p>;
    if (!relatedClient) return <p>No client data available for this opportunity.</p>;

    return (
        <MainLayout>
            <div className="opportunity-detail-container">
                <div className="back-arrow">
                    <button onClick={() => window.history.back()} className="back-btn">
                        <img src={back} alt="Back" />
                    </button>
                </div>
                {/* Opportunity Details */}
                <h2 className="opportunity-detail-title">Detalles de la Oportunidad</h2>
                {/* Related Client Information */}
                <div className="related-client-container">
                    <h3>Cliente Relacionado</h3>
                    <div className="related-client-info">
                        <div><strong>{relatedClient.name}</strong> </div>
                    </div>
                </div>
                <div className="opportunity-info-grid">
                    <div><strong>Nombre del Negocio</strong><p>{opportunityData.businessName}</p></div>
                    <div><strong>Línea de Negocio</strong><p>{opportunityData.businessLine}</p></div>
                    <div><strong>Descripción</strong><p>{opportunityData.description}</p></div>
                    <div><strong>Valor Estimado</strong><p>{opportunityData.estimatedValue}</p></div>
                    <div><strong>Fecha Estimada</strong><p>{opportunityData.estimatedDate}</p></div>
                    <div className="opportunity-status">
                        <strong>Estado</strong>
                        <p className={`status-${opportunityData.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {opportunityData.status}
                        </p>
                    </div>
                </div>

                <div>
                    <strong>Tabla Seguimiento</strong>
                    <FollowUpTable idOpportunity={Number(opportunityId)} />
                </div>
            </div>
        </MainLayout>
    );
};

export default OpportunityDetail;
