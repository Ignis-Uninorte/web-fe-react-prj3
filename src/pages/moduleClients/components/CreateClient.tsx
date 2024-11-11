import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import MainLayout from '../../../layouts/MainLayout';
import back from '../../../assets/back-arrow.svg';
import '../../../styles/CreateOpportunity.css';

interface OpportunityFormInputs {
  Id?: number; // Ensure 'Id' is optional
  clientId: string;
  businessName: string;
  businessLine: string;
  description: string;
  estimatedValue: number;
  estimatedDate: string;
  status: string;
}

interface Client {
  id: number;
  name: string;
}

const CreateOpportunity: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OpportunityFormInputs>();
  const [message, setMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error('Error fetching clients');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchClients();
  }, []);

  const onSubmit: SubmitHandler<OpportunityFormInputs> = async (data) => {
    data.status = "Apertura"; // Estado predeterminado en la creación

    try {
      // Fetch de oportunidades existentes para determinar el ID más alto
      const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/opportunities');
      const opportunities = await response.json();

      // Calcular el próximo ID único
      const maxId = opportunities.reduce((max: number, opp: { Id: number }) => Math.max(max, opp.Id || 0), 0);
      const newOpportunity = {
        Id: maxId + 1,
        ...data // Aseguramos que el Id sea la primera propiedad
      };

      // Enviar la nueva oportunidad con el ID autogenerado
      const submitResponse = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOpportunity),
      });

      if (submitResponse.ok) {
        setMessage('¡Oportunidad creada con éxito!');
        reset();
      } else {
        setMessage('Error al crear la oportunidad.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectarse con el servidor.');
    }
  };


  return (
    <MainLayout>
      <div className="create-opportunity-form container">
        <div className='back'>
          <div className='back-arrow'>
            <button onClick={() => window.history.back()} className="back-btn">
              <img src={back} alt="Back" />
            </button>
          </div>
        </div>
        <h2>Crear Nueva Oportunidad</h2>
        {message && <div className="notification">{message}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Cliente:</label>
            <select {...register('clientId', { required: 'El cliente es obligatorio' })}>
              <option value="">Seleccione un cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <span className="error">{errors.clientId.message}</span>}
          </div>

          <div className="form-group">
            <label>Nombre de Negocio:</label>
            <input type="text" {...register('businessName', { required: 'Nombre de negocio es obligatorio' })} />
            {errors.businessName && <span className="error">{errors.businessName.message}</span>}
          </div>

          <div className="form-group">
            <label>Línea de Negocio:</label>
            <select {...register('businessLine', { required: 'Línea de negocio es obligatoria' })}>
              <option value="">Seleccione la línea de negocio</option>
              <option value="outsourcing recursos">Outsourcing Recursos</option>
              <option value="desarrollo web">Desarrollo Web</option>
              <option value="desarrollo mobile">Desarrollo Mobile</option>
              <option value="consultoría TI">Consultoría TI</option>
            </select>
            {errors.businessLine && <span className="error">{errors.businessLine.message}</span>}
          </div>

          <div className="form-group">
            <label>Descripción de la Oportunidad:</label>
            <textarea {...register('description', { required: 'La descripción es obligatoria' })} />
            {errors.description && <span className="error">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Valor Estimado (COP):</label>
            <input type="number" {...register('estimatedValue', { required: 'Valor estimado es obligatorio' })} />
            {errors.estimatedValue && <span className="error">{errors.estimatedValue.message}</span>}
          </div>

          <div className="form-group">
            <label>Fecha Estimada:</label>
            <input type="date" {...register('estimatedDate', { required: 'Fecha estimada es obligatoria' })} />
            {errors.estimatedDate && <span className="error">{errors.estimatedDate.message}</span>}
          </div>

          <button type="submit" className="submit-btn">Guardar Oportunidad</button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateOpportunity;