import React, { useState } from 'react';
import Modal from 'react-modal';
import { useCreatePersonaMutation, useGetPersonasQuery } from '../../store/api';
import '../../styles/Modals.css';

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonaData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, firstName, dni, email, address, phone } = personaData;
    let validationErrors = {};

    if (name.length < 1 || name.length > 50) {
      validationErrors.name = 'El nombre debe tener entre 1 y 50 caracteres.';
    }
    if (firstName.length < 1 || firstName.length > 50) {
      validationErrors.firstName = 'El apellido debe tener entre 1 y 50 caracteres.';
    }
    if (isNaN(dni) || dni < 9999999 || dni > 99999999) {
      validationErrors.dni = 'El DNI debe tener 8 caracteres.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.email = 'El correo electrónico no es válido.';
    }
    if (address.length < 1 || address.length > 70) {
      validationErrors.address = 'La dirección debe tener entre 1 y 70 caracteres.';
    }
    if (phone && !/^\+?[1-9]\d{6,14}$/.test(phone)) {
      validationErrors.phone = 'El teléfono debe tener entre 7 y 15 dígitos, y puede comenzar con un +.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

      await refetch();
      setSelectedPersonaId(response.id);
      setPersonaData({
        name: '',
        firstName: '',
        dni: '',
        email: '',
        address: '',
        phone: '',
      });
      setErrors({});
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
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="firstName"
            value={personaData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>
        <div>
          <label>DNI:</label>
          <input
            type="number"
            name="dni"
            value={personaData.dni}
            onChange={handleChange}
          />
          {errors.dni && <div className="error-message">{errors.dni}</div>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={personaData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            name="address"
            value={personaData.address}
            onChange={handleChange}
          />
          {errors.address && <div className="error-message">{errors.address}</div>}
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="number"
            name="phone"
            value={personaData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        <button type="submit" disabled={isCreating}>Crear</button>
        {createError && <div className="error-message">Error: {createError?.data.detail}</div>}
      </form>
    </Modal>
  );
};

export default CreatePersonaModal;
