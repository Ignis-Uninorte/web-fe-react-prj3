import React from 'react';
import ClientTable from './components/ClientTable';
import '../../styles/main-moduleClients.css';
import { useNavigate } from 'react-router-dom';

const ModuleClient: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="body_moduleClient">
            <h1>Clientes</h1>
            <button onClick={() => navigate('/crear-cliente')} className="btn_crearcliente">Crear Cliente</button>
            <ClientTable />
        </div>
    );
}

export default ModuleClient;
