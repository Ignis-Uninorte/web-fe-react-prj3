import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  const handleCreateClient = () => {
    navigate('/crear-cliente');
  };

  return (
    <div>
      <h1>Clientes</h1>
      <button onClick={handleCreateClient}>Crear Cliente</button>
      {/* Aquí va la lista de clientes o el resto del contenido de la página */}
    </div>
  );
}

export default MainPage;
