import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/clientes.type';
import '../../../styles/clientTable.css';
import { useToggleClientStatus } from '../../../hooks/useClients';

const ClientTable: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [updatedClient, setUpdatedClient] = useState<Client | null>(null);
    const toggleClientStatus = useToggleClientStatus();

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

    // Fetch clients when the component mounts
    useEffect(() => {
        fetchClients();
    }, []);

    // Open the edit form with selected client data
    const handleUpdateClick = (client: Client) => {
        setEditingClient(client);
        setUpdatedClient(client);
    };

    // Handle input changes in the edit form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (updatedClient) {
            setUpdatedClient({
                ...updatedClient,
                [e.target.name]: e.target.value,
            });
        }
    };

    // Save updated client data to the backend using the NIT
    const handleSaveChanges = async () => {
        if (updatedClient) {
            try {
                const updateResponse = await fetch(
                    `https://three-web-be-json-server-api-ignis.onrender.com/clients/${updatedClient.nit}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedClient),
                    }
                );

                if (updateResponse.ok) {
                    alert('Cliente actualizado con éxito');
                    setEditingClient(null); // Close the edit form
                    fetchClients(); // Refresh data
                } else {
                    alert('Error al actualizar el cliente');
                }
            } catch (error) {
                console.error('Error al actualizar el cliente:', error);
            }
        }
    };

    // Toggle client status (active/inactive) directly in the state
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

    const navigate = useNavigate();
    // Handler function to navigate to the client detail page
    const handleNameClick = (clientName: string) => {
        navigate(`/client/${encodeURIComponent(clientName)}`); // Encodes the name for the URL
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
                            <td>
                                {/* Make the name clickable */}
                                <button 
                                    onClick={() => handleNameClick(client.name)}
                                    className="client-name-link" // Optional: you can style this as a link
                                >
                                    {client.name}
                                </button>
                            </td>
                            <td>{client.corporateEmail}</td>
                            <td>{client.active ? 'Si' : 'No'}</td>
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

            {editingClient && (
                <div className="edit-form">
                    <h3>Editar Cliente</h3>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="name"
                            value={updatedClient?.name || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="corporateEmail"
                            value={updatedClient?.corporateEmail || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    
                    <button onClick={handleSaveChanges}>Guardar Cambios</button>
                    <button onClick={() => setEditingClient(null)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default ClientTable;
