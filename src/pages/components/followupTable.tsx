import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowUp } from '../../types/followup.type';
import { useAllFollowUps } from '../../hooks/useFollowup';
import DataTable from 'react-data-table-component';
import columnsConfig from './columnConfig';
import ActionButtons from './actionButtons';

interface FollowUpTableProps {
    idOpportunity?: number;
}

const FollowUpTable: React.FC<FollowUpTableProps> = ({idOpportunity}: FollowUpTableProps) => {
    const { isLoading, isSuccess, isError, data: followUpData } = useAllFollowUps();
    const navigate = useNavigate();
    const [opportunities, setFollowUps] = useState<FollowUp[]>([]);

    useEffect(() => {
        if (isSuccess && followUpData) {
            let data = followUpData;
            if (idOpportunity != null){
                data = followUpData.filter((followUp: FollowUp) => followUp.opportunityId === idOpportunity);
            }
            setFollowUps(data);
        }
    }, [isSuccess, followUpData, idOpportunity]);;

    const handleNameClick = (followUpId: number) => {
        navigate(`/activities/${followUpId}`);
    };

    const actionButtons = [
        {
            label: 'Actualizar',
            onClick: (followup: FollowUp) => (console.log(followup)),
            className: 'action-btn update-opp-btn',
        },
        {
            label: 'Eliminar',
            onClick: (followup: FollowUp) =>  (console.log(followup)),
            className: 'action-btn delete-btn',
        },
    ];

    const baseColumns = [
        {
            name: 'ID',
            selector: (row: FollowUp) => row.id,
            sortable: true,
        },
        {
            name: 'ID Oportunidad Asociada',
            selector: (row: FollowUp) => row.opportunityId,
            sortable: true,
            cell: (row: FollowUp) => (
                <span
                    onClick={() => handleNameClick(Number(row.id))}
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {row.opportunityId}
                </span>
            ),
        },
        {
            name: 'Tipo de contacto',
            selector: (row: FollowUp) => row.contactType,
            sortable: true,
        },
        {
            name: 'Ejecutivo Comercial',
            selector: (row: FollowUp) => row.commercialExecutive,
            sortable: true,
        },
        {
            name: 'Descripción',
            selector: (row: FollowUp) => row.description,
            sortable: true,
        },
    ];

    const customColumns = [
        {
            name: 'Acciones',
            selector: undefined,
            sortable: false,
            cell: (row: FollowUp) => (
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
                    className="followup-table"
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

export default FollowUpTable;
