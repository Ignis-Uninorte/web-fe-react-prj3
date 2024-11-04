import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateClient from './pages/moduleClients/components/CreateClient';
import ModuleClient from './pages/moduleClients/main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModuleClient />} />
        <Route path="/crear-cliente" element={<CreateClient />} />
      </Routes>
    </Router>
  );
}

export default App;

