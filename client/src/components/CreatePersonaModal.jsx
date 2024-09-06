import React, { useState } from 'react';
import Modal from 'react-modal'; 
import { useCreatePersonaMutation, useGetPersonasQuery } from '../store/api';
import '../styles/CrearPersonaModal.css';

const CreatePersonaModal = ({ isOpen, onClose, setSelectedPersonaId }) => {
  const { refetch } = useGetPersonasQuery(); 
  const [createPersona, { isLoading: isCreating, error: createError }] = useCreatePersonaMutation();
  
  const [personaData, setPersonaData] = useState({
    name: '',
    firstName: '',
    dni: '',
    email: '',
    address: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonaData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, firstName, dni, email, address, phone } = personaData;

    if (name.length < 1 || name.length > 50) {
      alert('El nombre debe tener entre 1 y 50 caracteres.');
      return false;
    }
    if (firstName.length < 1 || firstName.length > 50) {
      alert('El apellido debe tener entre 1 y 50 caracteres.');
      return false;
    }
    if (isNaN(dni) || dni < 9999999 || dni > 99999999) {
      alert('El DNI debe tener 8 caracteres.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('El correo electrónico no es válido.');
      return false;
    }
    if (address.length < 1 || address.length > 70) {
      alert('La dirección debe tener entre 1 y 70 caracteres.');
      return false;
    }
    if (phone && phone.length < 7) {
      alert('El teléfono debe tener al menos 7 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = {
        name: personaData.name,
        first_name: personaData.firstName,
        dni: parseInt(personaData.dni, 10),
        email: personaData.email,
        address: personaData.address,
        phone: personaData.phone,
      };
  
      const response = await createPersona(data).unwrap();
      console.log('Persona creada:', response);
      
      await refetch();
      setSelectedPersonaId(response.id);
      setPersonaData({
        name: '',
        firstName: '',
        dni: '',
        email: '',
        address: '',
        phone: '',
      })
      onClose();
    } catch (err) {
      console.error('Error al crear la persona:', err);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="custom-modal"
      overlayClassName="custom-modal-overlay"
    >
      <div className="modal-header">
        <h2>Crear Persona</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            name="name" 
            value={personaData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input 
            type="text" 
            name="firstName" 
            value={personaData.firstName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>DNI:</label>
          <input 
            type="number" 
            name="dni" 
            value={personaData.dni} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={personaData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input 
            type="text" 
            name="address" 
            value={personaData.address} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input 
            type="text" 
            name="phone" 
            value={personaData.phone} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit" disabled={isCreating}>Crear</button>
        {createError && <div className="error-message">Error: {createError.message}</div>}
      </form>
    </Modal>
  );
};

export default CreatePersonaModal;
