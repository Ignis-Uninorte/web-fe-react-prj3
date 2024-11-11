// src/pages/moduleClients/components/ClientDetail.tsx
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useAllClients } from '../../../hooks/useClients';
import { Client, Contact } from '../../../types/clientes.type';
import back from '../../../assets/back-arrow.svg';
import '../../../styles/ClientDetail.css';

const ClientDetail: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();

    const decodedClientId = clientId ? decodeURIComponent(clientId) : '';
    const { data: clientsData, isLoading, error } = useAllClients();

    const clientData = useMemo(() => {
        if (!clientsData || !decodedClientId) return undefined;
        return clientsData.find((client: Client) =>
            client.name.toLowerCase() === decodedClientId.toLowerCase()
        );
    }, [clientsData, decodedClientId]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="error-message">Error: {error.message}</p>;
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
                        <strong>Activo</strong>
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
            </div>
        </MainLayout>
    );
};

export default ClientDetail;
