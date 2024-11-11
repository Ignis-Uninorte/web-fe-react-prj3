import React from 'react';
import '../../styles/main-moduleOportunity.css';
import OportuniyTable from './components/OpportunityTable';

const ModuleOportunity: React.FC = () => {
    return (
        <div className="body_moduleOportunity">
            <h1>Oportunidades</h1>
            <OportuniyTable />
        </div>
    );
}

export default ModuleOportunity;