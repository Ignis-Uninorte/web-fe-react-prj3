import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowUp } from '../../types/followup.type';
import { useFollowUpsByOpportunityId, useDeleteFollowUp } from '../../hooks/useFollowup';
import DataTable from 'react-data-table-component';
import columnsConfig from './columnConfig';
import ActionButtons from './actionButtons';
import DeleteConfirmationModal from '../moduleOpportunity/components/DeleteConfirmationModal';
import ModalUpdate from '../moduleActivity/components/modal';
import CreateActivity from '../moduleActivity/components/CreateActivity';

interface FollowUpTableProps {
    idOpportunity: number;
}

const FollowUpTable: React.FC<FollowUpTableProps> = ({ idOpportunity }) => {
    const { isLoading, isSuccess, isError, data: followUpData } = useFollowUpsByOpportunityId(idOpportunity);
    const deleteFollowUp = useDeleteFollowUp();
    const navigate = useNavigate();

    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<FollowUp | null>(null);

    useEffect(() => {
        if (isSuccess && followUpData) {
            setFollowUps(followUpData);
        }
    }, [isSuccess, followUpData]);

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

    // Actualizar
    const handleUpdateClick = (followUp: FollowUp) => {
        setSelectedActivity(followUp);
        setIsUpdateOpen(true); 
    };

    const actionButtons = [
        {
            label: 'Actualizar',
            onClick: handleUpdateClick,
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
            name: 'Ejecutivo Comercial',
            selector: (row: FollowUp) => row.commercialExecutive,
            sortable: true,
        },
        {
            name: 'Descripción',
            selector: (row: FollowUp) => row.description,
            sortable: true,
        },
        {
            name: 'Tipo de contacto',
            selector: (row: FollowUp) => row.contactType,
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

            {/* Update Modal for FollowUp */}
            <ModalUpdate isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
            <CreateActivity
                
                activityToEdit={selectedActivity}
                onClose={() => setIsUpdateOpen(false)}
            />
            </ModalUpdate>
        </div>
    );
};

export default FollowUpTable;
