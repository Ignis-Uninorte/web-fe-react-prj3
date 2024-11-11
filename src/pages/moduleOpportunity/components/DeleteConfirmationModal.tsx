import React from 'react';
import '../../../styles/Delete.css';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirmar Eliminación</h3>
                <p>¿Estás seguro de que deseas eliminar esta fila?</p>
                <div className="modal-actions">
                    <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
                    <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;