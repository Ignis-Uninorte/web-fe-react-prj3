import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useAllOpportunities } from '../../../hooks/useOpportunities';
import { Opportunity } from '../../../types/opportunities.type';
import back from '../../../assets/back-arrow.svg';
import '../../../styles/OpportunityDetail.css';
import FollowUpTable from '../../components/followupTable';

const OpportunityDetail: React.FC = () => {
    const { opportunityId } = useParams<{ opportunityId: string }>();
    const { data: opportunitiesData, isLoading, error } = useAllOpportunities();
    const opportunityData = useMemo(() => {
        if (!opportunitiesData || !opportunityId) return undefined;
        return opportunitiesData.find((opp: Opportunity) => opp.Id === opportunityId);
    }, [opportunitiesData, opportunityId]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="error-message">Error: {error.message}</p>;
    if (!opportunityData) return <p>No opportunity data available for ID "{opportunityId}".</p>;

    return (
        <MainLayout>
            <div className="opportunity-detail-container">
                <div className="back-arrow">
                    <button onClick={() => window.history.back()} className="back-btn">
                        <img src={back} alt="Back" />
                    </button>
                </div>
                <h2 className="opportunity-detail-title">Detalles de la Oportunidad</h2>
                <div className="opportunity-info-grid">
                    <div><strong>Nombre del Negocio</strong><p>{opportunityData.businessName}</p></div>
                    <div><strong>Línea de Negocio</strong><p>{opportunityData.businessLine}</p></div>
                    <div><strong>Descripción</strong><p>{opportunityData.description}</p></div>
                    <div><strong>Valor Estimado</strong><p>{opportunityData.estimatedValue}</p></div>
                    <div><strong>Fecha Estimada</strong><p>{opportunityData.estimatedDate}</p></div>
                    <div className="opportunity-status">
                        <strong>Estado</strong>
                        <p className={opportunityData.status === 'Apertura' ? 'status-open' : 'status-closed'}>
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
