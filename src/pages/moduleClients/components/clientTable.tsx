import React, { useState, useEffect } from 'react';
import { ListClients, Client } from '../../../types/clientes.type';
import '../../../styles/clientTable.css';

const ClientTable: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [updatedClient, setUpdatedClient] = useState<Client | null>(null);

    // Función para obtener los clientes del backend
    const fetchClients = async () => {
        try {
            const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    // Obtener los clientes cuando se monta el componente
    useEffect(() => {
        fetchClients();
    }, []);

    // Manejador para abrir el formulario de edición
    const handleUpdateClick = (client: Client) => {
        setEditingClient(client);
        setUpdatedClient(client);
    };

    // Manejador para el cambio en los campos de entrada
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (updatedClient) {
            setUpdatedClient({
                ...updatedClient,
                [e.target.name]: e.target.value,
            });
        }
    };

    // Manejador para enviar la actualización al backend usando el NIT
    const handleSaveChanges = async () => {
        if (updatedClient) {
            try {
                // Enviar la solicitud PUT para actualizar el cliente usando el NIT
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
                    setEditingClient(null); // Cerrar el formulario de edición
                    fetchClients(); // Volver a obtener los datos actualizados
                } else {
                    alert('Error al actualizar el cliente');
                }
            } catch (error) {
                console.error('Error al actualizar el cliente:', error);
            }
        }
    };

    return (
        <div className="table-container">
            <table className="client-table">
                <thead>
                    <tr>
                        <th>NIT</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Activo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.nit}>
                            <td>{client.nit}</td>
                            <td>{client.name}</td>
                            <td>{client.corporateEmail}</td>
                            <td>{client.active ? 'Si' : 'No'}</td>
                            <td>
                                <button
                                    className="action-btn update-btn"
                                    onClick={() => handleUpdateClick(client)}
                                >
                                    Actualizar
                                </button>
                                <button className="action-btn toggle-btn">
                                    {client.active ? 'Inactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Formulario de edición de cliente */}
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
