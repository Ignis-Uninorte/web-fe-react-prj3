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
  const [nit, setNit] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [corporateEmail, setCorporateEmail] = useState('');
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', lastName: '', email: '', phone: '' }]);
  };

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string) => {
    const re = /^\d+$/; // Only digits
    return re.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!nit || !name || !address || !city || !country || !phone || !corporateEmail) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }

    if (!validatePhone(nit)) {
      setMessage('El NIT debe contener solo números.');
      return;
    }

    if (!validatePhone(phone)) {
      setMessage('El número de teléfono solo puede contener dígitos.');
      return;
    }

    if (!validateEmail(corporateEmail)) {
      setMessage('Correo electrónico no válido.');
      return;
    }

    // Validate contacts
    for (const contact of contacts) {
      if (!contact.name || !contact.lastName || !contact.email || !contact.phone) {
        setMessage('Todos los campos de contacto son obligatorios.');
        return;
      }
      if (!validateEmail(contact.email)) {
        setMessage('Correo electrónico de contacto no válido.');
        return;
      }
      if (!validatePhone(contact.phone)) {
        setMessage('El número de teléfono del contacto solo puede contener dígitos.');
        return;
      }
    }

    const newClient = {
      nit,
      name,
      address,
      city,
      country,
      phone,
      corporateEmail,
      active,
      contacts,
    };

    try {
      const response = await fetch('https://three-web-be-json-server-api-ignis.onrender.com/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Client created:', data);
        setMessage('Cliente creado con éxito!');
        resetForm();
      } else {
        setMessage('Error al crear el cliente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectarse con el servidor.');
    }
  };

  const resetForm = () => {
    setNit('');
    setName('');
    setAddress('');
    setCity('');
    setCountry('');
    setPhone('');
    setCorporateEmail('');
    setActive(false);
    setContacts([{ name: '', lastName: '', email: '', phone: '' }]);
    setMessage(null); // Clear message
  };

  return (
    <div className="create-client-form">
      <h2>Crear Nuevo Cliente</h2>
      {message && <div className="notification">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>NIT:</label>
          <input 
            type="text" 
            value={nit} 
            onChange={(e) => setNit(e.target.value.replace(/\D/g, ''))} // Allow only numbers
            required 
          />
        </div>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Ciudad:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>País:</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Allow only numbers
            required 
          />
        </div>
        <div className="form-group">
          <label>Correo Corporativo:</label>
          <input 
            type="email" 
            value={corporateEmail} 
            onChange={(e) => setCorporateEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Activo:</label>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
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
              onChange={(e) => handleContactChange(index, 'phone', e.target.value.replace(/\D/g, ''))} // Allow only numbers
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
