import React, { useState } from 'react';
import { useGetCarrerasQuery, useCreateCarreraMutation } from '../store/api';

const CarreraSelect = ({ selectedCarreraId, onSelectCarrera }) => {
  const { data: carreras, refetch } = useGetCarrerasQuery();
  const [createCarrera, { isLoading: isCreating, error: createError }] = useCreateCarreraMutation();
  const [newCarrera, setNewCarrera] = useState('');

  const handleCreateCarrera = async () => {
    if (!newCarrera) return;
    try {
      const createdCarrera = await createCarrera({ name: newCarrera }).unwrap(); 
      setNewCarrera('');
      refetch(); 
      onSelectCarrera(createdCarrera.id);
    } catch (err) {
      alert('Error al crear la carrera');
    }
  };


  return (
    <div>
      <select value={selectedCarreraId} onChange={(e) => onSelectCarrera(e.target.value)}>
        <option value="">Seleccione una carrera</option>
        {carreras?.items?.map(carrera => (
          <option key={carrera.id} value={carrera.id}>{carrera.name}</option>
        ))}
      </select>
      <div>
        <input 
          type="text" 
          value={newCarrera} 
          onChange={(e) => setNewCarrera(e.target.value)} 
          placeholder="Nueva carrera"
        />
        <button onClick={handleCreateCarrera} disabled={isCreating}>Crear Carrera</button>
        {createError && <div>Error: {createError.message}</div>}
      </div>
    </div>
  );
};

export default CarreraSelect;
