import React, { useState } from 'react';
import '../../../styles/CreateClient.css';

interface Contact {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

const CreateClient: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([{ name: '', lastName: '', email: '', phone: '' }]);

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', lastName: '', email: '', phone: '' }]);
  };

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  return (
    <div className="create-client-form">
      <h2>Crear Nuevo Cliente</h2>
      <form>
        <div className="form-group">
          <label>NIT:</label>
          <input type="text" name="nit" />
        </div>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="name" />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input type="text" name="address" />
        </div>
        <div className="form-group">
          <label>Ciudad:</label>
          <input type="text" name="city" />
        </div>
        <div className="form-group">
          <label>País:</label>
          <input type="text" name="country" />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input type="text" name="phone" />
        </div>
        <div className="form-group">
          <label>Correo Corporativo:</label>
          <input type="email" name="corporateEmail" />
        </div>
        <div className="form-group">
          <label>Activo:</label>
          <input type="checkbox" name="active" />
        </div>

        <h3>Contactos Asociados</h3>
        {contacts.map((contact, index) => (
          <div className="contact-group" key={index}>
            <input
              type="text"
              placeholder="Nombre"
              value={contact.name}
              onChange={(e) => handleContactChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Apellido"
              value={contact.lastName}
              onChange={(e) => handleContactChange(index, 'lastName', e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo"
              value={contact.email}
              onChange={(e) => handleContactChange(index, 'email', e.target.value)}
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={contact.phone}
              onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddContact}>
          Agregar Contacto
        </button>

        <button type="submit">Guardar Cliente</button>
      </form>
    </div>
  );
};

export default CreateClient;
