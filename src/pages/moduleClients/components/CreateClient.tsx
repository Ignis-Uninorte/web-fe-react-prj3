import React, { useEffect, useState } from 'react';  
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
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
  id: number;
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

  // Función para obtener el máximo Id actual de los clientes y calcular el siguiente Id
  const fetchNextId = async () => {
    try {
      const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients');
      const clients = await response.json();

      // Obtiene el Id máximo y calcula el siguiente
      const maxId = clients.reduce((max: number, client: ClientFormInputs) => Math.max(max, client.id), 0);
      setNextId(maxId + 1);
    } catch (error) {
      console.error('Error al obtener el Id:', error);
      setMessage('Error al obtener el ID para el cliente.');
    }
  };

  // Llama a la función para obtener el próximo Id al cargar el componente
  useEffect(() => {
    fetchNextId();
  }, []);

  const onSubmit: SubmitHandler<ClientFormInputs> = async (data) => {
    if (nextId === null) return;  // Asegura que nextId esté disponible antes de continuar
  
    const clientData = {
      id: nextId, // Asigna el Id generado al cliente primero
      nit: data.nit,
      name: data.name,
      address: data.address,
      city: data.city,
      country: data.country,
      phone: data.phone,
      corporateEmail: data.corporateEmail,
      active: data.active,
      contacts: data.contacts,
    };
  
    try {
      const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
  
      if (response.ok) {
        setMessage('¡Cliente creado con éxito!');
        reset(); // Resetear el formulario después de enviar
        fetchNextId(); // Actualiza el siguiente Id para futuros clientes
      } else {
        setMessage('Error al crear el cliente.');
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
        <h2>Crear Nuevo Cliente</h2>
        {message && <div className="notification">{message}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>NIT:</label>
            <input type="text" {...register('nit', { required: 'El NIT es obligatorio', pattern: { value: /^\d+$/, message: 'Solo números' } })} />
            {errors.nit && <span className="error">{errors.nit.message}</span>}
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" {...register('name', { required: 'El nombre es obligatorio' })} />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Correo Corporativo:</label>
            <input type="email" {...register('corporateEmail', { required: 'Correo obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' } })} />
            {errors.corporateEmail && <span className="error">{errors.corporateEmail.message}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input 
              type="text" 
              {...register('phone', { 
                required: 'Teléfono obligatorio', 
                pattern: { value: /^\d+$/, message: 'Solo números' } 
              })} 
              inputMode="numeric" // Sugerir teclado numérico en dispositivos móviles
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
              <input placeholder="Correo" {...register(`contacts.${index}.email`, { required: 'Correo obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' } })} />
              <input 
                placeholder="Teléfono" 
                {...register(`contacts.${index}.phone`, { 
                  required: 'Teléfono obligatorio', 
                  pattern: { value: /^\d+$/, message: 'Solo números' } 
                })} 
                inputMode="numeric" // Sugerir teclado numérico en dispositivos móviles
              />

              <button type="button" onClick={() => remove(index)} className="delete-contact-btn">
                🗑️ {/* Icono de basura */}
              </button>

              {errors.contacts?.[index]?.name && <span className="error">{errors.contacts[index].name?.message}</span>}
              {errors.contacts?.[index]?.lastName && <span className="error">{errors.contacts[index].lastName?.message}</span>}
              {errors.contacts?.[index]?.email && <span className="error">{errors.contacts[index].email?.message}</span>}
              {errors.contacts?.[index]?.phone && <span className="error">{errors.contacts[index].phone?.message}</span>}
            </div>
          ))}
          <div className="button-container">
            <button type="button" className="add-contact-btn" onClick={() => append({ name: '', lastName: '', email: '', phone: '' })}>
              Agregar Contacto
            </button>

            <button type="submit">Guardar Cliente</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateClient;