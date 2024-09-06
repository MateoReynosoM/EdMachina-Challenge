import React, { useState } from 'react';
import { useGetMateriasQuery, useCreateMateriaMutation } from '../store/api'; 

const MateriaSelect = ({ selectedMaterias, setSelectedMaterias }) => {
  const { data: materias, refetch } = useGetMateriasQuery(); 
  const [createMateria, { isLoading: isCreating, error: createError }] = useCreateMateriaMutation();
  const [newMateria, setNewMateria] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedMateriaId, setSelectedMateriaId] = useState('');

  const handleCreateMateria = async () => {
    if (!newMateria) return;
    try {
      const createdMateria = await createMateria({ name: newMateria, duration: duration }).unwrap(); 
      setNewMateria('');
      setDuration('')
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
      setSelectedMateriaId('');
    } catch (err) {
      alert('Error al crear la materia');
    }
  };

  const handleSelectChange = (e) => {
    const materiaId = e.target.value;
    if (materiaId) {
      const materia = materias.items.find(m => String(m.id) === String(materiaId));
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
        console.error('Materia no encontrada en el array de materias');
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
      <select value={selectedMateriaId} onChange={handleSelectChange}>
        <option value="">Seleccione una materia</option>
        {materias?.items?.filter(materia => !selectedMaterias.find(m => m.id === materia.id))
          .map(materia => (
            <option key={materia.id} value={materia.id}>{materia.name}</option>
          ))
        }
      </select>
      <div>
        <input 
          style={{ paddingLeft: '20px' }}
          type="text" 
          value={newMateria} 
          onChange={(e) => setNewMateria(e.target.value)} 
          placeholder="Nueva materia"
        />
        <input 
        style={{ paddingLeft: '20px' }}
          type="number" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          placeholder="Duracion Materia"
        />
        <button onClick={handleCreateMateria} disabled={isCreating}>Crear Materia</button>
        {createError && <div>Error: {createError.message}</div>}
      </div>
      <div>
        {selectedMaterias.map(materia => (
          <div key={materia.id} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
            <span>{materia.name} (ID: {materia.id})</span>
            <input 
              type="number" 
              value={materia.inscriptionYear} 
              onChange={(e) => handleInputChange(materia.id, 'inscriptionYear', e.target.value)} 
              placeholder="Año de inscripción" 
            />
            <input 
              type="number" 
              value={materia.attendanceTimes} 
              onChange={(e) => handleInputChange(materia.id, 'attendanceTimes', e.target.value)} 
              placeholder="Veces que se recurrió" 
            />
            <button onClick={() => handleRemoveRow(materia.id)} style={{ marginLeft: '10px' }}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MateriaSelect;
