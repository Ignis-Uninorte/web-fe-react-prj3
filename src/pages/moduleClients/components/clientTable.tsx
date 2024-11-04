import React from 'react';
import {ListClients} from '../../../types/clientes.type'
import '../../../styles/clientTable.css';
import { useToggleClientStatus } from '../../../hooks/useClients';

const ClientTable: React.FC<ListClients> = ({ clients }) => {
    const toggleClientStatus = useToggleClientStatus();

    const handleToggle = (clientId: number, currentStatus: boolean) => {
        toggleClientStatus.mutate({ clientId, currentStatus });
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
                        <tr key={client.nit}  className={client.active ? '' : 'inactive-row'}>
                            <td>{client.id}</td>
                            <td>{client.nit}</td>
                            <td>{client.name}</td>
                            <td>{client.corporateEmail}</td>
                            <td>{client.active ? 'Si' : "No"}</td>
                            <td>
                                <button className="action-btn update-btn" disabled={!client.active} >Actualizar</button>
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