import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import "../../styles/Modals.css";

const UpdateEntityModal = ({ isOpen, onClose, entity, onUpdate, fields, entityName }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entity) {
      const initialData = {};
      fields.forEach((field) => {
        initialData[field.name] = entity[field.name] || '';
      });
      setFormData(initialData);
    }
  }, [entity, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let validationErrors = {};
    
    fields.forEach((field) => {
      if (field.required && (!formData[field.name] || formData[field.name].length < field.minLength || formData[field.name].length > field.maxLength)) {
        validationErrors[field.name] = field.errorMessage;
      }
      if (field.type === 'number' && isNaN(formData[field.name])) {
        validationErrors[field.name] = 'Debe ser un número válido.';
      }
      if (field.name === 'phone' && formData.phone && !/^\+?[1-9]\d{6,14}$/.test(formData.phone)) {
        validationErrors.phone = 'El teléfono debe tener entre 7 y 15 dígitos y puede comenzar con un +.';
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onUpdate(entity.id, formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="custom-modal"
      overlayClassName="custom-modal-overlay"
      contentLabel={`Actualizar ${entityName}`}
    >
      <div className="modal-header">
        <h2>Actualizar {entityName}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              readOnly={field.readOnly || false}
            />
            {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
          </div>
        ))}
        <div className="modal-actions">
          <button type="submit">Guardar</button>
          <button className="cancel-button" type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateEntityModal;
