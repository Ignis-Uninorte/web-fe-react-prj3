import React from 'react';
import '../../styles/main-moduleOportunity.css';
import OportuniyTable from './components/OpportunityTable';
import { useNavigate } from 'react-router-dom';

const ModuleOportunity: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="body_moduleOportunity">
            <h1>Oportunidades</h1>
            <button onClick={() => navigate('/crear-oportunidad')} className="btn_crearoportunidad">
                Crear Oportunidad
            </button>
            <OportuniyTable />
        </div>
    );
}

export default ModuleOportunity;