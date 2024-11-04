import React from 'react';
import ClientTable from './components/clientTable';
import '../../styles/main-moduleClients.css';
import { useNavigate } from 'react-router-dom';

const ModuleClient: React.FC = () => {
    const clients = [
        //Se debe cambiar para recibir los clientes de la api (preguntar a backend)
        { id: 1, 
            nit: 123456789,
            name: 'Juan Perez', 
            direction: 'Calle 123',
            city: 'Bogota',
            country: 'Colombia',
            email: 'juan@example.com', 
            activo: true },
        { id: 2,
            nit: 987654321,
            name: 'Maria Rodriguez', 
            direction: 'Calle 456',
            city: 'Medellin',
            country: 'Colombia',
            email: 'a@a.com',
            activo: false },
    ];

    const navigate = useNavigate();
    return (
        <div>
            <h1>Clientes</h1>
            <button onClick={() => navigate('/crear-cliente')}>Crear Cliente</button>
                <div className="body_moduleClient">
                    <h1>Listado de Clientes</h1>
                    <ClientTable clients={clients} />
                </div>
        </div>
    );
}

export default ModuleClient;
