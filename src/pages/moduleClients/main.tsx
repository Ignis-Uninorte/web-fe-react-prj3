import React from 'react';
import ClientTable from './components/ClientTable';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/main-moduleClients.css';
import { useAllClients } from '../../hooks/useClients';
import { useNavigate } from 'react-router-dom';

const ModuleClient: React.FC = () => {
    const {isLoading, isSuccess, isError, data: clients} = useAllClients();
    const navigate = useNavigate();
    return (
        <MainLayout>
        <div>
            {isLoading && (
                <p>Cargando...</p>
            )}
            {isError && (
                <p>Hubo un error</p>
            )}
            {!isLoading && !isError && isSuccess && clients &&  (
                <div>
                    <h1>Clientes</h1>
                    <button onClick={() => navigate('/crear-cliente')} className="btn_crearcliente"><b>Crear Cliente</b></button>
                        <div className="body_moduleClient">
                            <ClientTable />
                        </div>
                </div>
            )}
        </div>
        </MainLayout>
        
);
}

export default ModuleClient;
