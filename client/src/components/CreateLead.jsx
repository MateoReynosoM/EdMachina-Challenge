import React, { useState } from 'react';
import { useCreateLeadMutation } from '../store/api';
import MateriaSelect from './MateriaSelect';
import CarreraSelect from './CarreraSelect';
import PersonaSelect from './PersonaSelect';
import CreatePersonaModal from './CreatePersonaModal';
import '../styles/CrearLead.css';

const CrearLeads = () => {
  const [createLead, { isLoading, error }] = useCreateLeadMutation();
  const [personaId, setPersonaId] = useState('');
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="crear-leads-container">
      <h2>Crear Lead</h2>
      <form onSubmit={handleSubmit}>
        <label>Persona:</label>
        <div className="form-group">
          <PersonaSelect
            selectedPersonaId={personaId}
            onSelectPersona={setPersonaId}
            onCreatePersona={handleOpenModal}
          />
        </div>
        <label>Materia:</label>
        <div className="form-group">
          <MateriaSelect 
            selectedMaterias={selectedMaterias} 
            setSelectedMaterias={setSelectedMaterias} 
          />
        </div>
        <label>Carrera:</label>
        <div className="form-group">
          <CarreraSelect 
            selectedCarreraId={selectedCarreraId} 
            onSelectCarrera={setSelectedCarreraId} 
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={isLoading}>Crear Lead</button>
        </div>
        {error && <div className="error-message">Error: {error.message}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>

      <CreatePersonaModal isOpen={isModalOpen} onClose={handleCloseModal} setSelectedPersonaId={setPersonaId} />
    </div>
  );
};

export default CrearLeads;
