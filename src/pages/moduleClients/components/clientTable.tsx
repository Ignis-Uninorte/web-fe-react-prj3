import React from 'react';
import {ListClients} from '../../../types/clientes'
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
                <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.nit}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.activo ? 'Si' : "No"}</td>
                    <td>
                        <button className="action-btn update-btn">Actualizar</button>
                        <button className="action-btn toggle-btn">
                            {client.activo ? 'Inactivar' : 'Activar'}
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