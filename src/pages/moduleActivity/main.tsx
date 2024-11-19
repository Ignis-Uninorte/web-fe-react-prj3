import React from 'react';
import '../../styles/main-moduleActivity.css';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import FollowUpTable from '../components/followupTable';

const ModuleActivity: React.FC = () => {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div className="body_moduleActivity">
                <h1>Seguimiento</h1>
                <button onClick={() => navigate('/crear-actividad')} className="btn_crearactividad"> <b>Crear Actividad</b></button>
                <FollowUpTable />
            </div>
        </MainLayout>
    );
}

export default ModuleActivity;