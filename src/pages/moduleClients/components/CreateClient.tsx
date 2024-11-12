import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../styles/CreateClient.css';
import back from '../../../assets/back-arrow.svg';

interface Contact {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ClientFormInputs {
  id?: number;
  nit: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  corporateEmail: string;
  active: boolean;
  contacts: Contact[];
}

const CreateClient: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ClientFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);
  const { nit } = useParams<{ nit: string }>();
  const navigate = useNavigate();
  const isEditing = !!nit; 

  
  const fetchNextId = async () => {
    try {
      const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients');
      const clients = await response.json();
      const maxId = clients.reduce((max: number, client: ClientFormInputs) => Math.max(max, client.id || 0), 0);
      setNextId(maxId + 1);
    } catch (error) {
      console.error('Error al obtener el Id:', error);
      setMessage('Error al obtener el ID para el cliente.');
    }
  };

  useEffect(() => {
    if (isEditing) {
      const fetchClientData = async () => {
        try {
          const response = await fetch(`https://three-web-be-json-server-api-ignis.onrender.com/clients/${nit}`);
          if (response.ok) {
            const clientData = await response.json();
            reset(clientData); 
          } else {
            setMessage('Error al cargar los datos del cliente.');
          }
        } catch (error) {
          console.error('Error al cargar los datos del cliente:', error);
          setMessage('Error al conectarse con el servidor.');
        }
      };
      fetchClientData();
    } else {
      fetchNextId();
    }
  }, [isEditing, nit, reset]);


  const onSubmit: SubmitHandler<ClientFormInputs> = async (data) => {
    const clientData = isEditing
      ? data
      : {
          ...data,
          id: nextId, 
        };

    try {
      const response = await fetch(
        `https://three-web-be-json-server-api-ignis.onrender.com/clients${isEditing ? `/${nit}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        }
      );

      if (response.ok) {
        setMessage(isEditing ? '¡Cliente actualizado con éxito!, Redirigiendo en 2seg' : '¡Cliente creado con éxito!');
        if (!isEditing) reset(); 
        setTimeout(() => navigate('/'), 2000); 
      } else {
        setMessage('Error al guardar el cliente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectarse con el servidor.');
    }
  };

  return (
    <MainLayout>
      <div className="create-client-form container">
        <div className='back'>
          <div className='back-arrow'>
            <button onClick={() => window.history.back()} className="back-btn">
              <img src={back} alt="Back" />
            </button>
          </div>
        </div>
        <h2>{isEditing ? 'Actualizar Cliente' : 'Crear Nuevo Cliente'}</h2>
        {message && <div className="notification">{message}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>NIT:</label>
            <input
              type="text"
              {...register('nit', { required: 'El NIT es obligatorio', pattern: { value: /^\d+$/, message: 'Solo números' } })}
              disabled={isEditing} // Disable NIT field if editing
            />
            {errors.nit && <span className="error">{errors.nit.message}</span>}
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" {...register('name', { required: 'El nombre es obligatorio' })} />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Correo Corporativo:</label>
            <input
              type="email"
              {...register('corporateEmail', {
                required: 'Correo obligatorio',
                pattern: { value: /^[^\s@]+@[^\s@]+$/, message: 'Correo inválido' },
              })}
            />
            {errors.corporateEmail && <span className="error">{errors.corporateEmail.message}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              {...register('phone', { required: 'Teléfono obligatorio', pattern: { value: /^\d+$/, message: 'Solo números' } })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label>Activo:</label>
            <input type="checkbox" {...register('active')} />
          </div>

          <h3>Contactos Asociados</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="contact-group">
              <input placeholder="Nombre" {...register(`contacts.${index}.name`, { required: 'Nombre obligatorio' })} />
              <input placeholder="Apellido" {...register(`contacts.${index}.lastName`, { required: 'Apellido obligatorio' })} />
              <input placeholder="Correo" type="email" {...register(`contacts.${index}.email`, {
                required: 'Correo obligatorio',
                pattern: { value: /^[^\s@]+@[^\s@]+$/, message: 'Correo inválido' },
              })} />
              <input placeholder="Teléfono" {...register(`contacts.${index}.phone`, {
                required: 'Teléfono obligatorio',
                pattern: { value: /^\d+$/, message: 'Solo números' },
              })} />

              <button type="button" onClick={() => remove(index)} className="delete-contact-btn">🗑️</button>
            </div>
          ))}

          <div className="button-container">
            <button type="button" className="add-contact-btn" onClick={() => append({ name: '', lastName: '', email: '', phone: '' })}>
              Agregar Contacto
            </button>
            <button type="submit">{isEditing ? 'Guardar Cambios' : 'Guardar Cliente'}</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateClient;
