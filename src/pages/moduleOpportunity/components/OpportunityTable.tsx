import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../../../types/opportunities.type';
import '../../../styles/opportunityTable.css';
import { useAllOpportunities } from '../../../hooks/useOpportunities';
import DataTable from 'react-data-table-component';
import columnsConfig from '../../components/columnConfig';
import ActionButtons from '../../components/actionButtons';

const OpportunityTable: React.FC = () => {
    const { isLoading, isSuccess, isError, data: opportunitiesData } = useAllOpportunities();
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    useEffect(() => {
        if (isSuccess && opportunitiesData) {
            setOpportunities(opportunitiesData);
        }
    }, [isSuccess, opportunitiesData]);

    const handleRowClick = (opportunityId: number) => {
        navigate(`/opportunity/${opportunityId}`);
    };

    const baseColumns = [
        {
            name: 'ID',
            selector: (row: Opportunity) => row.Id,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: (row: Opportunity) => row.businessName,
            sortable: true,
        },
        {
            name: 'Linea de negocio',
            selector: (row: Opportunity) => row.businessLine,
            sortable: true,
        },
        {
            name: 'Estado',
            selector: (row: Opportunity) => row.status,
            sortable: true,
            cell: (row: Opportunity) => <div>{row.status}</div>,
        },
        {
            name: 'Fecha de realización',
            selector: (row: Opportunity) => row.estimatedDate,
            sortable: true,
            cell: (row: Opportunity) => new Date(row.estimatedDate).toLocaleDateString(),
        },
    ];

    const actionButtons = [
        {
            label: 'Actualizar',
            onClick: (opportunity: Opportunity) => navigate(`/opportunity/update/${opportunity.Id}`),
            className: 'action-btn update-btn',
        },
        {
            label: 'Eliminar',
            onClick: () => alert('Oportunidad eliminada (sin funcionalidad en esta historia)'),
            className: 'action-btn delete-btn',
        },
    ];

    const customColumns = [
        {
            name: 'Acciones',
            selector: undefined,
            sortable: false,
            cell: (row: Opportunity) => (
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
                    data={opportunities}
                    pagination
                    onRowClicked={(row) => handleRowClick(Number(row.Id))}
                    className='opportunity-table'
                    customStyles={{
                        headCells: {
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#4CAF50',
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

export default OpportunityTable;
