import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateClient from './pages/moduleClients/components/CreateClient';
import ModuleClient from './pages/moduleClients/main';
import ClientDetail from './pages/moduleClients/components/ClientDetail';
import ModuleOpportunity from './pages/moduleOpportunities/main'; // Main opportunities module
import CreateOpportunity from './pages/moduleOpportunities/components/CreateOpportunity'; // Opportunity creation form

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Existing routes */}
          <Route path="/" element={<ModuleClient />} />
          <Route path="/crear-cliente" element={<CreateClient />} />
          <Route path="/client/:clientId" element={<ClientDetail />} />

          {/* New routes for opportunities module */}
          <Route path="/oportunidades" element={<ModuleOpportunity />} />
          <Route path="/crear-oportunidad" element={<CreateOpportunity />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
