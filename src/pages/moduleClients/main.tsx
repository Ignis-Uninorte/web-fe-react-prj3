import React from 'react';
import ClientTable from './components/ClientTable';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/main-moduleClients.css';
import { useNavigate } from 'react-router-dom';

const ModuleClient: React.FC = () => {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div className="body_moduleClient">
                <h1>Clientes</h1>
                <button onClick={() => navigate('/crear-cliente')} className="btn_crearcliente"><b>Crear Cliente</b></button>
                <ClientTable />
            </div>
        </MainLayout>
    );
}

export default ModuleClient;
