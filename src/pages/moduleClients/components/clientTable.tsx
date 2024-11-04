import React from 'react';
import {ListClients} from '../../../types/clientes.type'
import '../../../styles/clientTable.css';

const ClientTable: React.FC<ListClients> = ({ clients }) => {
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
                    <td>{client.corporateEmail}</td>
                    <td>{client.active ? 'Si' : "No"}</td>
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