// OpportunityTable.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../../../types/opportunities.type';
import '../../../styles/opportunityTable.css';
import { useAllOpportunities, useDeleteOpportunity } from '../../../hooks/useOpportunities';
import DataTable from 'react-data-table-component';
import columnsConfig from '../../components/columnConfig';
import ActionButtons from '../../components/actionButtons';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const OpportunityTable: React.FC = () => {
    const { isLoading, isSuccess, isError, data: opportunitiesData } = useAllOpportunities();
    const deleteOpportunity = useDeleteOpportunity();
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isSuccess && opportunitiesData) {
            setOpportunities(opportunitiesData);
        }
    }, [isSuccess, opportunitiesData]);

    const handleRowClick = (opportunityId: number) => {
        navigate(`/opportunity/${opportunityId}`);
    };

    const handleDeleteClick = (opportunityId: string) => {
        console.log("Delete clicked for opportunityId:", opportunityId);
        setSelectedOpportunityId(opportunityId);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedOpportunityId) {
            console.log("Confirming delete for selectedOpportunityId:", selectedOpportunityId); // Log the ID being deleted
            deleteOpportunity.mutate(selectedOpportunityId, {
                onSuccess: () => {
                    console.log("Delete successful for opportunityId:", selectedOpportunityId);
                    setOpportunities(prevOpportunities =>
                        prevOpportunities.filter(opportunity => opportunity.Id !== selectedOpportunityId)
                    );
                    setIsModalOpen(false);
                    setSelectedOpportunityId(null);
                },
                onError: (error) => {
                    console.error("Delete failed for opportunityId:", selectedOpportunityId, error);
                }
            });
        } else {
            console.warn("No selectedOpportunityId found to delete.");
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setSelectedOpportunityId(null);
    };

    const actionButtons = [
        {
            label: 'Actualizar',
            onClick: (opportunity: Opportunity) => navigate(`/opportunity/update/${opportunity.Id}`),
            className: 'action-btn update-opp-btn',
        },
        {
            label: 'Eliminar',
            onClick: (opportunity: Opportunity) => handleDeleteClick(opportunity.Id),
            className: 'action-btn delete-btn',
        },
    ];

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

            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default OpportunityTable;
