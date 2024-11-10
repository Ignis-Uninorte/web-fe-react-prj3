import React from 'react';
import '../../styles/main-moduleOpportunities.css';
import { useNavigate } from 'react-router-dom';

const ModuleOpportunity: React.FC = () => {
    const navigate = useNavigate();

    console.log("ModuleOpportunity renderizado"); // Añadir un log

    return (
        <div>
            <h1>Oportunidades</h1>
            <button onClick={() => navigate('/crear-oportunidad')} className="btn_crearoportunidad">
                Crear Oportunidad
            </button>
        </div>
    );
}
export default ModuleOpportunity;
