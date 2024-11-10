import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import '../../../styles/CreateClient.css';

interface Contact {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ClientFormInputs {
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

  const onSubmit: SubmitHandler<ClientFormInputs> = async (data) => {
    try {
      const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('¡Cliente creado con éxito!');
        reset();  // Resetear el formulario después de enviar
      } else {
        setMessage('Error al crear el cliente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectarse con el servidor.');
    }
  };

  return (
    <div className="create-client-form container">
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

        {/* Campos adicionales para dirección, ciudad, país, etc. */}

        <div className="form-group">
          <label>Correo Corporativo:</label>
          <input type="email" {...register('corporateEmail', { required: 'Correo obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' } })} />
          {errors.corporateEmail && <span className="error">{errors.corporateEmail.message}</span>}
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input type="text" {...register('phone', { required: 'Teléfono obligatorio', pattern: { value: /^\d+$/, message: 'Solo números' } })} />
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
            <input placeholder="Teléfono" {...register(`contacts.${index}.phone`, { required: 'Teléfono obligatorio', pattern: { value: /^\d+$/, message: 'Solo números' } })} />

            <button type="button" onClick={() => remove(index)} className="delete-contact-btn">
              🗑️ {/* Icono de basura */}
            </button>

            {errors.contacts?.[index]?.name && <span className="error">{errors.contacts[index].name?.message}</span>}
            {/* Similar error messages for other contact fields */}
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
  );
};

export default CreateClient;
