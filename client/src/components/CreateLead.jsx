import React, { useState } from 'react';
import { useCreateLeadMutation } from '../store/api';
import MateriaSelect from './Selects/MateriaSelect';
import CarreraSelect from './Selects/CarreraSelect';
import PersonaSelect from './Selects/PersonaSelect';
import CreatePersonaModal from './Modals/CreatePersonaModal';
import '../styles/CrearLead.css';

const CreateLeads = () => {
  const [createLead, { isLoading, error }] = useCreateLeadMutation();
  const [personaId, setPersonaId] = useState('');
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateFields = () => {
    let validationErrors = {};

    if (!personaId) {
      validationErrors.persona = 'Selecciona una persona.';
    }
    if (!selectedCarreraId) {
      validationErrors.carrera = 'Selecciona una carrera.';
    }
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
    if (selectedMaterias.length === 0) {
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

    const materias_ids = selectedMaterias.map((materia) => ({
      materia_id: materia.id,
      year_of_inscription: materia.inscriptionYear,
      attendance_times: materia.attendanceTimes
    }));

    try {
      const result = await createLead({
        persona_id: personaId,
        carrera_id: selectedCarreraId,
        materias_ids
      }).unwrap();

      setSuccessMessage(`Lead creado exitosamente. ID: ${result.id}`);
    } catch (err) {
      alert('Error al crear el lead');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePersonaChange = (value) => {
    setPersonaId(value);
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, persona: '' }));
    }
  };

  const handleCarreraChange = (value) => {
    setSelectedCarreraId(value);
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, carrera: '' }));
    }
  };

  const handleMateriaChange = (materias) => {
    setSelectedMaterias(materias);
    const materiaErrors = {};
    materias.forEach(materia => {
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
    if (materias.length === 0) {
      materiaErrors.global = 'Selecciona al menos una materia.';
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      materias: materiaErrors
    }));
  };

  return (
    <div className="crear-leads-container">
      <h2>Crear Lead</h2>
      <form onSubmit={handleSubmit}>
        <label>Persona:</label>
        <div className="form-group">
          <PersonaSelect
            selectedPersonaId={personaId}
            onSelectPersona={handlePersonaChange}
            onCreatePersona={handleOpenModal}
          />
          {isSubmitted && errors.persona && <div style={errorMessage}>{errors.persona}</div>}
        </div>

        <label>Materia:</label>
        <div className="form-group">
          <MateriaSelect
            selectedMaterias={selectedMaterias}
            setSelectedMaterias={handleMateriaChange}
            errors={isSubmitted ? errors.materias || {} : {}}
          />
          {isSubmitted && errors.materias && errors.materias.global && (
            <div style={errorMessage}>{errors.materias.global}</div>
          )}
        </div>

        <label>Carrera:</label>
        <div className="form-group">
          <CarreraSelect
            selectedCarreraId={selectedCarreraId}
            onSelectCarrera={handleCarreraChange}
          />
          {isSubmitted && errors.carrera && <div style={errorMessage}>{errors.carrera}</div>}
        </div>

        <div className="form-group">
          <button type="submit" disabled={isLoading}>Crear Lead</button>
        </div>

        {error && <div style={errorMessage}>Error: {error.detail}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>

      <CreatePersonaModal isOpen={isModalOpen} onClose={handleCloseModal} setSelectedPersonaId={setPersonaId} />
    </div>
  );
};

const errorMessage = {
  color: "red",
  marginLeft: "10px",
  marginBottom: "6px"
}

export default CreateLeads;
