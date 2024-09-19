import React, { useState } from 'react';
import { useGetCarrerasQuery, useCreateCarreraMutation } from '../../store/api';
import CreateCarreraModal from '../Modals/CreateCarreraModal';

const CarreraSelect = ({ selectedCarreraId, onSelectCarrera }) => {
  const { data: carreras, refetch } = useGetCarrerasQuery();
  const [createCarrera, { isLoading: isCreating, error: createError }] = useCreateCarreraMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCreateCarrera = async (name) => {
    try {
      const createdCarrera = await createCarrera({ name }).unwrap();
      refetch();
      onSelectCarrera(createdCarrera.id);
    } catch (err) {
      console.error('Error al crear la carrera');
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
      <button type='button' onClick={() => setIsModalOpen(true)} style={{ maxHeight: '37px' }}>
        Crear Carrera
      </button>
      <CreateCarreraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCarrera={handleCreateCarrera}
        isLoading={isCreating}
        createError={createError}
      />
    </div>
  );
};

export default CarreraSelect;
