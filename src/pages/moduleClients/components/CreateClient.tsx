import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useClientData, useNextClientId } from '../../../hooks/useClients';
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
  const { nit } = useParams<{ nit: string }>();
  const navigate = useNavigate();
  const isEditing = !!nit;

  // Hooks para obtener datos del cliente y el próximo ID
  const { data: clientData, isError: clientError, isLoading: clientLoading } = useClientData(nit);
  const { data: nextId, isError: nextIdError, isLoading: nextIdLoading } = useNextClientId();

  // Manejo de errores y carga inicial
  useEffect(() => {
    if (clientError) {
      setMessage('Error al cargar los datos del cliente.');
    } else if (clientData) {
      reset(clientData);
    }

    if (nextIdError) {
      setMessage('Error al obtener el ID para el cliente.');
    }
  }, [clientData, clientError, nextIdError, reset]);

  const onSubmit: SubmitHandler<ClientFormInputs> = async (data) => {
    // Arrange data in the correct order
    const clientData = isEditing
      ? {
        id: parseInt(nit || '0'), // Use the existing ID for editing
        nit: data.nit,
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
        corporateEmail: data.corporateEmail,
        active: data.active,
        contacts: data.contacts || [], // Ensure contacts is an array, even if empty
      }
      : {
        id: nextId, // Use the next available ID for creating
        nit: data.nit,
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
        corporateEmail: data.corporateEmail,
        active: data.active,
        contacts: data.contacts || [], // Ensure contacts is an array, even if empty
      };

    try {
      const response = await fetch(
        `https://three-web-be-json-server-api-ignis.onrender.com/clients${isEditing ? `/${nit}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData), // Send properly ordered data
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
        <div className="back">
          <div className="back-arrow">
            <button onClick={() => window.history.back()} className="back-btn">
              <img src={back} alt="Back" />
            </button>
          </div>
        </div>
        <h2>{isEditing ? 'Actualizar Cliente' : 'Crear Nuevo Cliente'}</h2>
        {message && <div className="notification">{message}</div>}
        {(clientLoading || nextIdLoading) && <p>Cargando datos...</p>}
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
            <label>Dirección:</label>
            <input
              type="text"
              {...register('address', { required: 'La dirección es obligatoria' })}
            />
            {errors.address && <span className="error">{errors.address.message}</span>}
          </div>

          <div className="form-group">
            <label>País:</label>
            <input
              type="text"
              {...register('country', { required: 'El país es obligatorio' })}
            />
            {errors.country && <span className="error">{errors.country.message}</span>}
          </div>

          <div className="form-group">
            <label>Ciudad:</label>
            <input
              type="text"
              {...register('city', { required: 'La ciudad es obligatoria' })}
            />
            {errors.city && <span className="error">{errors.city.message}</span>}
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