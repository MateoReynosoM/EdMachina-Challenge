import React from 'react';
import { useGetPersonasQuery } from '../store/api'; 

const PersonaSelect = ({ selectedPersonaId, onSelectPersona, onCreatePersona }) => {
  const { data: personas = [], isLoading } = useGetPersonasQuery();

  return (
    <div>
      <select 
        value={selectedPersonaId} 
        onChange={(e) => onSelectPersona(e.target.value)} 
        required
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
    </div>
  );
};

export default PersonaSelect;
