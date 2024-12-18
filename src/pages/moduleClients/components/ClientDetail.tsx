import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useAllClients } from '../../../hooks/useClients';
import { useOpportunitiesByClientId } from '../../../hooks/useOpportunities';
import { Client, Contact } from '../../../types/clientes.type';
import FollowUpTable from '../../components/followupTable';
import back from '../../../assets/back-arrow.svg';
import '../../../styles/ClientDetail.css';
import { Opportunity } from '../../../types/opportunities.type';

const ClientDetail: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const decodedClientId = clientId ? decodeURIComponent(clientId) : '';

    const { data: clientsData, isLoading: clientsLoading, error: clientsError } = useAllClients();
    const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);

    // Get the current client
    const clientData = useMemo(() => {
        if (!clientsData || !decodedClientId) return undefined;
        return clientsData.find((client: Client) =>
            client.name.toLowerCase() === decodedClientId.toLowerCase()
        );
    }, [clientsData, decodedClientId]);

    // Fetch opportunities for the current client
    const { data: clientOpportunities, isLoading: oppLoading, error: oppError } = useOpportunitiesByClientId(clientData?.id);

    const handleNameClick = (opportunityId: number) => {
        navigate(`/opportunity/${opportunityId}`); // Navigate to opportunity details
    };

    const handleSeguimientoClick = (opportunityId: number) => {
        setSelectedOpportunityId(opportunityId);
    };

    // Handle loading and error states
    if (clientsLoading || oppLoading) return <p>Loading...</p>;
    if (clientsError) return <p className="error-message">Error: {clientsError.message}</p>;
    if (oppError) return <p className="error-message">Error: {oppError.message}</p>;
    if (!clientData) return <p>No client data available for "{decodedClientId}".</p>;

    return (
        <MainLayout>
            <div className="client-detail-container">
                <div className="back-arrow">
                    <button onClick={() => window.history.back()} className="back-btn">
                        <img src={back} alt="Back" />
                    </button>
                </div>
                <h2 className="client-detail-title">Detalles del cliente</h2>
                <div className="client-info-grid">
                    <div><strong>Nombre</strong><p>{clientData.name}</p></div>
                    <div><strong>NIT</strong><p>{clientData.nit}</p></div>
                    <div><strong>Email corporativo</strong><p>{clientData.corporateEmail}</p></div>
                    <div className="client-status">
                        <strong>Estado</strong>
                        <p className={clientData.active ? 'status-active' : 'status-inactive'}>
                            {clientData.active ? 'Activo' : 'Inactivo'}
                        </p>
                    </div>
                    <div><strong>Dirección</strong><p>{clientData.address}</p></div>
                    <div><strong>Ciudad</strong><p>{clientData.city}</p></div>
                    <div><strong>País</strong><p>{clientData.country}</p></div>
                </div>
                <h3 className="associated-contacts-title">Contactos asociados</h3>
                {clientData.contacts && clientData.contacts.length > 0 ? (
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientData.contacts.map((contact: Contact, index: number) => (
                                <tr key={index}>
                                    <td>{contact.name}</td>
                                    <td>{contact.lastName}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay contactos asociados.</p>
                )}

                {/* Display Opportunities */}
                <h3 className="associated-opportunities-title">Oportunidades de negocio</h3>
                {clientOpportunities && clientOpportunities.length > 0 ? (
                    <table className="opportunities-table">
                        <thead>
                            <tr>
                                <th>Nombre de Oportunidad</th>
                                <th>Línea de Negocio</th>
                                <th>Descripción</th>
                                <th>Valor Estimado</th>
                                <th>Fecha Estimada</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientOpportunities.map((opp: Opportunity) => (
                                <tr key={opp.Id}>
                                    <td>
                                        <span
                                            onClick={() => handleNameClick(Number(opp.Id))}
                                            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {opp.businessName}
                                        </span>
                                    </td>
                                    <td>{opp.businessLine}</td>
                                    <td>{opp.description}</td>
                                    <td>{opp.estimatedValue}</td>
                                    <td>{opp.estimatedDate}</td>
                                    <td>{opp.status}</td>
                                    <td>
                                        <button
                                            className="seguimiento-btn"
                                            onClick={() => handleSeguimientoClick(Number(opp.Id))}
                                        >
                                            Seguimiento
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay oportunidades asociadas.</p>
                )}

                {/* Follow-Up Table */}
                {selectedOpportunityId && (
                    <div className="followup-table-container">
                        <h3>Seguimientos para Oportunidad {selectedOpportunityId}</h3>
                        <FollowUpTable idOpportunity={selectedOpportunityId} />
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ClientDetail;
