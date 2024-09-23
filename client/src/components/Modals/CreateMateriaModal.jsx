import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../styles/Modals.css';

const CreateMateriaModal = ({ isOpen, onClose, onCreateMateria, isLoading, createError }) => {
  const [materiaData, setMateriaData] = useState({
    name: '',
    duration: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMateriaData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, duration } = materiaData;
    let validationErrors = {};

    if (name.length < 1 || name.length > 50) {
      validationErrors.name = 'El nombre debe tener entre 1 y 50 caracteres.';
    }
    if (isNaN(duration) || duration <= 0) {
      validationErrors.duration = 'La duración debe ser un número positivo.';
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
        name: materiaData.name,
        duration: parseInt(materiaData.duration, 10),
      };

      await onCreateMateria(data);
      setMateriaData({
        name: '',
        duration: '',
      });
      setErrors({});
      
    } catch (err) {
      console.error('Error al crear la materia:', err);
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
        <h2>Crear Materia</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la Materia:</label>
          <input
            type="text"
            name="name"
            value={materiaData.name}
            onChange={handleChange}
            placeholder="Nombre de la materia"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div>
          <label>Duración (en horas):</label>
          <input
            type="number"
            name="duration"
            value={materiaData.duration}
            onChange={handleChange}
            placeholder="Duración de la materia"
          />
          {errors.duration && <div className="error-message">{errors.duration}</div>}
        </div>
        <button type="submit" disabled={isLoading}>Crear Materia</button>
        {createError && <div className="error-message">Error: {createError?.data?.detail}</div>}
      </form>
    </Modal>
  );
};

export default CreateMateriaModal;
