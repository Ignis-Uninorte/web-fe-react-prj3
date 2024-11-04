import React from 'react';
import ClientTable from './components/clientTable';
import '../../styles/main-moduleClients.css';
import { useAllClients } from '../../hooks/useClients';
import { useNavigate } from 'react-router-dom';

const ModuleClient: React.FC = () => {
    const {data: clients} = useAllClients();
    console.log(clients);
    const navigate = useNavigate();
    return (
        <div>
            <h1>Clientes</h1>
            <button onClick={() => navigate('/crear-cliente')} className="btn_crearcliente">Crear Cliente</button>
                <div className="body_moduleClient">
                    <ClientTable clients={clients} />
                </div>
        </div>
    );
}

export default ModuleClient;
