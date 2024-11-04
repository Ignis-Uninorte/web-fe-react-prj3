import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/moduleClients/components/MainPage';
import CreateClient from './pages/moduleClients/components/CreateClient';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/crear-cliente" element={<CreateClient />} />
      </Routes>
    </Router>
  );
}

export default App;

