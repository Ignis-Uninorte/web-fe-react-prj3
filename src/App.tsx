import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateClient from './pages/moduleClients/components/CreateClient';
import ModuleClient from './pages/moduleClients/main';
import ClientDetail from './pages/moduleClients/components/ClientDetail';
import ModuleOpportunity from './pages/moduleOpportunity/main';
import CreateOpportunity from './pages/moduleOpportunity/components/CreateOpportunity';
import CreateActivity from './pages/moduleActivity/components/CreateActivity'; // Import your new component
import ModuleActivity from './pages/moduleActivity/main';
import OpportunityDetail from './pages/moduleOpportunity/components/OpportunityDetail';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<ModuleClient />} />
          <Route path="/crear-cliente" element={<CreateClient />} />
          <Route path="/crear-cliente/:nit" element={<CreateClient />} /> {/* Ruta para editar cliente */}
          <Route path="/client/:clientId" element={<ClientDetail />} />
          <Route path="/opportunity/:opportunityId" element={<OpportunityDetail />} />
          <Route path="/oportunidades" element={<ModuleOpportunity />} />
          <Route path="/crear-oportunidad" element={<CreateOpportunity />} /> {/* Ruta para crear nueva oportunidad */}
          <Route path="/opportunity/update/:opportunityId" element={<CreateOpportunity />} /> {/* Ruta para editar oportunidad */}

          <Route path="/seguimiento" element={<ModuleActivity />} />
          <Route
            path="/crear-seguimiento"
            element={<CreateActivity />} // Ruta para crear nueva actividad sin activityId
          />
          <Route
            path="/actualizar-seguimiento/:activityId"
            element={<CreateActivity  />} // Ruta para actualizar actividad con activityId
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
