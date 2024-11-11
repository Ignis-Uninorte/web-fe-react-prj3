import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/clientes.type';
import '../../../styles/clientTable.css';
import { getAllClients, toggleClientStatus } from '../../../services/clients.services'; // Cambia la ruta aquí

const ClientTable: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const navigate = useNavigate();

    // Fetch clients from the backend
    const fetchClients = async () => {
        try {
            const data = await getAllClients(); // Usa el servicio
            setClients(data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleUpdateClick = (client: Client) => {
        navigate(`/crear-cliente/${client.nit}`);
    };

    // Toggle client status (active/inactive) directly in the state
    const handleToggle = async (clientNit: number, currentStatus: boolean) => {
        try {
            const updatedClient = await toggleClientStatus(clientNit, currentStatus); // Usa el servicio
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client.nit === clientNit
                        ? { ...client, active: !currentStatus } // Toggle the active status
                        : client
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado del cliente:', error);
        }
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
