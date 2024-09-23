import React, { useState } from 'react';
import { useGetMateriasQuery, useCreateMateriaMutation } from '../../store/api';
import CreateMateriaModal from '../Modals/CreateMateriaModal';

const MateriaSelect = ({ selectedMaterias, setSelectedMaterias, errors }) => {
  const { data: materias, refetch } = useGetMateriasQuery();
  const [createMateria, { isLoading: isCreating, error: createError }] = useCreateMateriaMutation();
  const [selectedMateriaId, setSelectedMateriaId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateMateria = async (materiaData) => {
    try {
      const createdMateria = await createMateria(materiaData).unwrap();
      setSelectedMaterias([
        ...selectedMaterias,
        {
          id: createdMateria.id,
          name: createdMateria.name,
          inscriptionYear: '',
          attendanceTimes: ''
        }
      ]);
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al crear la materia', err);
    }
  };

  const handleSelectChange = (e) => {
    const materiaId = e.target.value;
    if (materiaId) {
      const materia = materias?.items?.find(m => String(m.id) === String(materiaId));
      if (materia) {
        setSelectedMaterias([
          ...selectedMaterias,
          {
            id: materia.id,
            name: materia.name,
            inscriptionYear: '',
            attendanceTimes: ''
          }
        ]);
        setSelectedMateriaId('');
      } else {
        console.error('Materia no encontrada en el array de materias', { materias: materias?.items, materiaId });
      }
    }
  };

  const handleInputChange = (id, field, value) => {
    setSelectedMaterias(selectedMaterias.map(materia =>
      materia.id === id ? { ...materia, [field]: value } : materia
    ));
  };

  const handleRemoveRow = (id) => {
    setSelectedMaterias(selectedMaterias.filter(materia => materia.id !== id));
    refetch();
  };

  return (
    <div>
      <select style={select} value={selectedMateriaId} onChange={handleSelectChange}>
        <option value="">Seleccione una materia</option>
        {materias?.items?.filter(materia => !selectedMaterias.find(m => m.id === materia.id))
          .map(materia => (
            <option key={materia.id} value={materia.id}>{materia.name}</option>
          ))
        }
      </select>

      <button type="button" onClick={() => setIsModalOpen(true)}>Crear nueva materia</button>

      <CreateMateriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateMateria={handleCreateMateria}
        createError={createError}
        isLoading={isCreating}
      />

      <div>
        {selectedMaterias.map(materia => (
          <div key={materia.id} style={{ display: 'flex', alignItems: "baseline" }}>
            <span style={{ marginLeft: '10px' }}>{materia.name}</span>
            <div  style={{ marginLeft: '10px' }}>
              <input
                type="number"
                value={materia.inscriptionYear}
                onChange={(e) => handleInputChange(materia.id, 'inscriptionYear', e.target.value)}
                placeholder="Año de inscripción"
              />
              {errors[materia.id]?.inscriptionYear && (
                <div style={errorMessage}>{errors[materia.id].inscriptionYear}</div>
              )}
            </div>
            <div  style={{ marginLeft: '10px' }}>
              <input
                type="number"
                value={materia.attendanceTimes}
                onChange={(e) => handleInputChange(materia.id, 'attendanceTimes', e.target.value)}
                placeholder="Veces que se recurrió"
              />
              {errors[materia.id]?.attendanceTimes && (
                <div style={errorMessage}>{errors[materia.id].attendanceTimes}</div>
              )}
            </div>
            <button onClick={() => handleRemoveRow(materia.id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const errorMessage = {
  color: "red",
  marginLeft: "12px",
  marginBottom: "6px"
}

const select = {
  marginBottom: '15px',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
}

export default MateriaSelect;
