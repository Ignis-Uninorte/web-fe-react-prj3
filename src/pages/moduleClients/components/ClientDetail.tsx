// src/pages/moduleClients/components/ClientDetail.tsx
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useAllClients } from '../../../hooks/useClients';
import { Client, Contact } from '../../../types/clientes.type';
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
            {/* Client Info Row */}
            <div className="client-info-row">
                <div className="info-item"><strong>Name:</strong> {clientData.name}</div>
                <div className="info-item"><strong>NIT:</strong> {clientData.nit}</div>
                <div className="info-item"><strong>Address:</strong> {clientData.address}</div>
                <div className="info-item"><strong>City:</strong> {clientData.city}</div>
                <div className="info-item"><strong>Country:</strong> {clientData.country}</div>
                <div className="info-item"><strong>Corporate Email:</strong> {clientData.corporateEmail}</div>
                <div className="info-item"><strong>Active:</strong> {clientData.active ? 'Yes' : 'No'}</div>
            </div>

            {/* Associated Contacts */}
            {clientData.contacts && clientData.contacts.length > 0 && (
                <div className="client-contacts">
                    <h2>Associated Contacts</h2>
                    <div className="contacts-grid">
                        {clientData.contacts.map((contact: Contact, index: number) => (
                            <div className="contact-card" key={index}>
                                <div className="contact-card-item"><strong>Name:</strong> {contact.name}</div>
                                <div className="contact-card-item"><strong>Last Name:</strong> {contact.lastName}</div>
                                <div className="contact-card-item"><strong>Email:</strong> {contact.email}</div>
                                <div className="contact-card-item"><strong>Phone:</strong> {contact.phone}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </MainLayout>
    );
};

export default ClientDetail;
