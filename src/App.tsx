import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/moduleClients/components/MainPage';
import CreateClient from './pages/moduleClients/components/CreateClient';
import ModuleClient from './pages/moduleClients/main'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/crear-cliente" element={<CreateClient />} />
        <Route path="/listado-clientes" element={<ModuleClient />} />
      </Routes>
    </Router>
  );
}

export default App;

