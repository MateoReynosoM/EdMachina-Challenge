import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PersonaSelect from '../Selects/PersonaSelect';
import MateriaSelect from '../Selects/MateriaSelect';
import CarreraSelect from '../Selects/CarreraSelect';
import "../../styles/Modals.css";

const UpdateLeadModal = ({ isOpen, onClose, entity, onUpdate, materias }) => {
  const [formData, setFormData] = useState({
    persona_id: '',
    carrera_id: '',
    materias: []
  });

  const [initialData, setInitialData] = useState(null); 
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getMateriaName = (materiaId) => {
    const materia = materias?.items?.find((m) => m.id === materiaId);
    return materia ? materia.name : 'Unknown';
  };  

  useEffect(() => {
    if (entity) {
      const initialFormData = {
        persona_id: entity.persona_id || '',
        carrera_id: entity.carrera_id || '',
        materias: entity.materias_ids.map(m => ({
          id: m.materia_id,
          inscriptionYear: m.year_of_inscription || '',
          attendanceTimes: m.attendance_times || '',
          name: getMateriaName(m.materia_id) || ''
        })) || []
      };
      setFormData(initialFormData);
      setInitialData(initialFormData); 
    }
  }, [entity]);

  const handleClose = () => {
    setFormData(initialData);
    onClose();
  };


  const validateFields = () => {
    let validationErrors = {};

    if (!formData.persona_id) {
      validationErrors.persona_id = 'Selecciona una persona.';
    }
    if (!formData.carrera_id) {
      validationErrors.carrera_id = 'Selecciona una carrera.';
    }
    
    const materiaErrors = {};
    formData.materias.forEach((materia, index) => {
      const errors = {};
      if (!materia.inscriptionYear) {
        errors.inscriptionYear = 'El campo es requerido.';
      } else if (materia.inscriptionYear < 1900 || materia.inscriptionYear > 2024) {
        errors.inscriptionYear = 'Indica una fecha válida.';
      }
      if (!materia.attendanceTimes) {
        errors.attendanceTimes = 'El campo es requerido.';
      } else if (materia.attendanceTimes < 0) {
        errors.attendanceTimes = 'El número debe ser positivo.';
      }
      if (Object.keys(errors).length > 0) {
        materiaErrors[materia.id] = errors;
      }
    });

    if (formData.materias.length === 0) {
      materiaErrors.global = 'Selecciona al menos una materia.';
    }

    if (Object.keys(materiaErrors).length > 0) {
      validationErrors.materias = materiaErrors;
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validateFields()) return;

    const updatedData = {
      persona_id: formData.persona_id,
      carrera_id: formData.carrera_id,
      materias_ids: formData.materias.map(m => ({
        materia_id: m.id,
        year_of_inscription: m.inscriptionYear,
        attendance_times: m.attendanceTimes
      }))
    };

    await onUpdate(entity.id, updatedData);
    onClose();
  };

  const handleMateriaChange = (selectedMaterias) => {
    const updatedMaterias = selectedMaterias.map(m => ({
      id: m.id,
      inscriptionYear: m.inscriptionYear || '',
      attendanceTimes: m.attendanceTimes || '',
      name: m.name || ''
    }));
    setFormData((prevData) => ({ ...prevData, materias: updatedMaterias }));

    const materiaErrors = {};
    selectedMaterias.forEach(materia => {
      const errors = {};
      if (!materia.inscriptionYear) {
        errors.inscriptionYear = 'El campo es requerido.';
      } else if (materia.inscriptionYear < 1900 || materia.inscriptionYear > 2024) {
        errors.inscriptionYear = 'Indica una fecha válida.';
      }
      if (!materia.attendanceTimes) {
        errors.attendanceTimes = 'El campo es requerido.';
      } else if (materia.attendanceTimes < 0) {
        errors.attendanceTimes = 'El número debe ser positivo.';
      }
      if (Object.keys(errors).length > 0) {
        materiaErrors[materia.id] = errors;
      }
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      materias: materiaErrors
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="custom-modal"
      overlayClassName="custom-modal-overlay"
      contentLabel="Actualizar Lead"
    >
      <div className="modal-header">
        <h2>Actualizar Lead</h2>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="persona_id">Persona:</label>
          <PersonaSelect
            selectedPersonaId={formData.persona_id}
            setSelectedPersonaId={(value) => handleChange({ target: { name: 'persona_id', value } })}
            onSelectPersona={(value) => handleChange({ target: { name: 'persona_id', value } })}
          />
          {isSubmitted && errors.persona_id && <div className="error-message">{errors.persona_id}</div>}
        </div>

        <div>
          <label htmlFor="materias">Materias:</label>
          <MateriaSelect
            selectedMaterias={formData.materias}
            setSelectedMaterias={handleMateriaChange}
            errors={isSubmitted ? errors.materias || {} : {}}
          />
          {isSubmitted && errors.materias && errors.materias.global && (
            <div className="error-message">{errors.materias.global}</div>
          )}
        </div>

        <div>
          <label htmlFor="carrera_id">Carrera:</label>
          <CarreraSelect
            selectedCarreraId={formData.carrera_id}
            onSelectCarrera={(value) => handleChange({ target: { name: 'carrera_id', value } })}
          />
          {isSubmitted && errors.carrera_id && <div className="error-message">{errors.carrera_id}</div>}
        </div>

        <div className="modal-actions">
          <button type="submit">Guardar</button>
          <button className="cancel-button" type="button" onClick={handleClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateLeadModal;
