import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowUp } from '../../types/followup.type';
import { useAllFollowUps, useDeleteFollowUp } from '../../hooks/useFollowup';
import DataTable from 'react-data-table-component';
import columnsConfig from './columnConfig';
import ActionButtons from './actionButtons';
import DeleteConfirmationModal from '../moduleOpportunity/components/DeleteConfirmationModal';

interface FollowUpTableProps {
    idOpportunity?: number;
}

const FollowUpTable: React.FC<FollowUpTableProps> = ({ idOpportunity }) => {
    const { isLoading, isSuccess, isError, data: followUpData } = useAllFollowUps();
    const deleteFollowUp = useDeleteFollowUp();
    const navigate = useNavigate();

    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isSuccess && followUpData) {
            let data = followUpData;
            if (idOpportunity != null) {
                data = followUpData.filter((followUp: FollowUp) => followUp.opportunityId === idOpportunity);
            }
            setFollowUps(data);
        }
    }, [isSuccess, followUpData, idOpportunity]);

    const handleDeleteClick = (followUp: FollowUp) => {
        setSelectedFollowUp(followUp); 
        setIsModalOpen(true); 
    };

    const confirmDelete = () => {
        if (selectedFollowUp) {
            deleteFollowUp.mutate(selectedFollowUp.id, {
                onSuccess: () => {
                    
                    setFollowUps((prevFollowUps) =>
                        prevFollowUps.filter((f) => f.id !== selectedFollowUp.id)
                    );
                    setSelectedFollowUp(null);
                    setIsModalOpen(false); 
                },
            });
        }
    };

    const cancelDelete = () => {
        setSelectedFollowUp(null); 
        setIsModalOpen(false); 
    };

    const actionButtons = [
        {
            label: 'Actualizar',
            onClick: (followUp: FollowUp) => navigate(`/activities/update/${followUp.id}`),
            className: 'action-btn update-opp-btn',
        },
        {
            label: 'Eliminar',
            onClick: handleDeleteClick,
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
                    onClick={() => navigate(`/activities/${row.id}`)}
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
                    data={followUps}
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

            {/* Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default FollowUpTable;