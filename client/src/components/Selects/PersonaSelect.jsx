import React, { useState } from 'react';
import { useGetPersonasQuery } from '../../store/api';
import CreatePersonaModal from '../Modals/CreatePersonaModal';

const PersonaSelect = ({ selectedPersonaId, onSelectPersona, setSelectedPersonaId }) => {
  const { data: personas = [], isLoading } = useGetPersonasQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>

      <select
        style={select}
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
      <button style={{}} type="button" onClick={()=>setIsModalOpen(true)}>Crear Persona</button>
      <CreatePersonaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setSelectedPersonaId={setSelectedPersonaId}
      />
    </div>
  );
};

const select = {
  marginBottom: '15px',
  padding: '10px',
  paddingRight: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
}

export default PersonaSelect;
