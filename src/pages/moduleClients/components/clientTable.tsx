import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/clientes.type';
import '../../../styles/clientTable.css';
import { useToggleClientStatus } from '../../../hooks/useClients';

const ClientTable: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const toggleClientStatus = useToggleClientStatus();
    const navigate = useNavigate();

    // Fetch clients from the backend
    const fetchClients = async () => {
        try {
            const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleUpdateClick = (client: Client) => {
        // Redirige a la página de edición con el NIT del cliente
        navigate(`/crear-cliente/${client.nit}`);
    };

    const handleToggle = (clientNit: number, currentStatus: boolean) => {
        toggleClientStatus.mutate(
            { clientId: clientNit, currentStatus },
            {
                onSuccess: () => {
                    setClients((prevClients) =>
                        prevClients.map((client) =>
                            client.nit === clientNit
                                ? { ...client, active: !currentStatus } // Toggle the active status
                                : client
                        )
                    );
                },
            }
        );
    };

    return (
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
                        <tr key={client.nit} className={client.active ? '' : 'inactive-row'}>
                            <td>{client.id}</td>
                            <td>{client.nit}</td>
                            <td>{client.name}</td>
                            <td>{client.corporateEmail}</td>
                            <td>{client.active ? 'Sí' : 'No'}</td>
                            <td>
                                <button
                                    className="action-btn update-btn"
                                    onClick={() => handleUpdateClick(client)}
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
    );
};

export default ClientTable;
