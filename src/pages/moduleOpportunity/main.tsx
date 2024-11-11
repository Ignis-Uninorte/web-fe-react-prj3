import React from 'react';
import '../../styles/main-moduleOportunity.css';
import MainLayout from '../../layouts/MainLayout';
import OportuniyTable from './components/OpportunityTable';
import { useNavigate } from 'react-router-dom';

const ModuleOportunity: React.FC = () => {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div className="body_moduleOportunity">
                <h1>Oportunidades</h1>
                <button onClick={() => navigate('/crear-oportunidad')} className="btn_crearoportunidad">
                    Crear Oportunidad
                </button>
                <OportuniyTable />
            </div>
        </MainLayout>
    );
}

export default ModuleOportunity;