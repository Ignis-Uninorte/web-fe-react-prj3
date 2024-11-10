import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/clientes.type';
import '../../../styles/clientTable.css';
import { useToggleClientStatus, useAllClients } from '../../../hooks/useClients';

const ClientTable: React.FC = () => {
    const { isLoading, isSuccess, isError, data: clientsData } = useAllClients();
    const toggleClientStatus = useToggleClientStatus();

    const navigate = useNavigate();

    // Estado local para la lista de clientes
    const [clients, setClients] = useState<Client[]>([]);

    // Cargar datos de clientes en el estado local una vez se recuperen de la API
    useEffect(() => {
        if (isSuccess && clientsData) {
            setClients(clientsData);
        }
    }, [isSuccess, clientsData]);

    const handleToggle = (clientNit: number, currentStatus: boolean) => {
        toggleClientStatus.mutate(
            { clientId: clientNit, currentStatus },
            {
                onSuccess: () => {
                    setClients((prevClients) =>
                        prevClients.map((client) =>
                            client.nit === clientNit
                                ? { ...client, active: !currentStatus }
                                : client
                        )
                    );
                },
            }
        );
    };

    const handleRowClick = (clientName: string) => {
        navigate(`/client/${encodeURIComponent(clientName)}`);
    };

    return (
        <>
            {isLoading && <p>Cargando...</p>}
            {isError && <p>Hubo un error</p>}
            {!isLoading && !isError && isSuccess && (
                <div className="table-container">
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NIT</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr
                                    key={client.nit}
                                    className={client.active ? 'active-row' : 'inactive-row'}
                                    onClick={() => handleRowClick(client.name)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{client.id}</td>
                                    <td>{client.nit}</td>
                                    <td>{client.name}</td>
                                    <td>{client.corporateEmail}</td>
                                    <td>{client.active ? 'Sí' : 'No'}</td>
                                    <td
                                        className="btns-line"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="action-btn update-btn"
                                            onClick={() => navigate(`/client/update/${client.nit}`)}
                                            disabled={!client.active}
                                        >
                                            Actualizar
                                        </button>
                                        <button
                                            className="action-btn toggle-btn"
                                            onClick={() => handleToggle(client.nit, client.active)}
                                        >
                                            {client.active ? 'Inactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ClientTable;

