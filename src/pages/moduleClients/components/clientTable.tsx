import React from 'react';
import {ListClients} from '../../../types/clientes'
import '../../../styles/clientTable.css';

const ClientTable: React.FC<ListClients> = ({ clients }) => {
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
                <tr key={client.nit}>
                    <td>{client.id}</td>
                    <td>{client.nit}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.activo ? 'Si' : "No"}</td>
                    <td>
                        <button className="action-btn update-btn">Actualizar</button>
                        <button className="action-btn toggle-btn">
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