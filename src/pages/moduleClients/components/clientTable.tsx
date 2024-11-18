import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/clientes.type';
import '../../../styles/clientTable.css';
import { useToggleClientStatus, useAllClients } from '../../../hooks/useClients';
import DataTable from 'react-data-table-component';
import columnsConfig from '../../components/columnConfig';
import ActionButtons from '../../components/actionButtons';

const ClientTable: React.FC = () => {
    const { isLoading, isSuccess, isError, data: clientsData } = useAllClients();
    const toggleClientStatus = useToggleClientStatus();
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        if (isSuccess && clientsData) {
            setClients(clientsData);
        }
    }, [isSuccess, clientsData]);

    // Toggle client status
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

    // Handle update click to navigate to the edit page with client NIT
    const handleUpdateClick = (client: Client) => {
        navigate(`/crear-cliente/${client.nit}`);
    };

    const handleNameClick = (clientName: string) => {
        navigate(`/client/${encodeURIComponent(clientName)}`); // Encodes the name for the URL
    };

    const baseColumns = [
        {
            name: 'ID',
            selector: (row: Client) => row.id,
            sortable: true,
        },
        {
            name: 'NIT',
            selector: (row: Client) => row.nit,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: (row: Client) => row.name,
            sortable: true,
            cell: (row: Client) => (
                <span
                    onClick={() => handleNameClick(row.name)}
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {row.name}
                </span>
            ),
        },
        {
            name: 'Email',
            selector: (row: Client) => row.corporateEmail,
            sortable: true,
        },
        {
            name: 'Activo',
            selector: (row: Client) => row.active,
            sortable: true,
            cell: (row: Client) => <div>{row.active ? 'Sí' : 'No'}</div>,
        },
    ];

    const actionButtons = [
        {
            label: (client: Client) => (client.active ? 'Inactivar' : 'Activar'),
            onClick: (client: Client) => handleToggle(client.nit, client.active),
            className: 'action-btn toggle-btn',
        },
        {
            label: 'Actualizar',
            onClick: (client: Client) => handleUpdateClick(client),
            className: 'action-btn update-btn',
            disabled: (client: Client) => !client.active,
        },
    ];

    const customColumns = [
        {
            name: 'Acciones',
            selector: undefined,
            sortable: false,
            cell: (row: Client) => (
                <ActionButtons item={row} navigate={navigate} actions={actionButtons} />
            ),
        },
    ];

    return (
        <div className="table-container">
            {isLoading && <p>Cargando...</p>}
            {isError && <p>Hubo un error</p>}
            {!isLoading && !isError && isSuccess && (
                <DataTable
                    columns={columnsConfig({ baseColumns, customColumns })}
                    data={clients}
                    pagination
                    className="client-table"
                    customStyles={{
                        headCells: {
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#0c1e2c',
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        },
                        cells: {
                            style: {
                                padding: '12px 15px',
                                textAlign: 'center',
                                borderBottom: '1px solid #ddd',
                            },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default ClientTable;
