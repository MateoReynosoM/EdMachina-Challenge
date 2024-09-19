import React, { useState } from 'react';
import { useGetPersonasQuery } from '../../store/api';
import CreatePersonaModal from '../Modals/CreatePersonaModal';

const PersonaSelect = ({ selectedPersonaId, onSelectPersona, onCreatePersona, setSelectedPersonaId }) => {
  const { data: personas = [], isLoading } = useGetPersonasQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>

      <select
        value={selectedPersonaId}
        onChange={(e) => onSelectPersona(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Seleccione una persona</option>
        {personas?.items?.map((persona) => (
          <option key={persona.id} value={persona.id}>
            {persona.name} {persona.first_name}
          </option>
        ))}
      </select>
      <button type="button" onClick={onCreatePersona}>Crear Persona</button>
      <CreatePersonaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setSelectedPersonaId={setSelectedPersonaId}
      />
    </div>
  );
};

export default PersonaSelect;
