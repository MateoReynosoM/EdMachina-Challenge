import React, { useState } from 'react';
import {
  useGetMateriasQuery,
  useGetCarrerasQuery,
  useGetPersonasQuery,
  useGetLeadsQuery,
  useUpdatePersonaMutation,
  useDeletePersonaMutation,
  useUpdateMateriaMutation,
  useDeleteMateriaMutation,
  useUpdateCarreraMutation,
  useDeleteCarreraMutation,
  useDeleteLeadMutation,
  useUpdateLeadMutation
} from '../store/api';

import Table from './Table';
import FilterInput from './FilterInput';
import '../styles/Info.css';
import DeleteModal from './Modals/DeleteModal';
import UpdatePersonaModal from './Modals/UpdatePersonaModal';
import UpdateCarreraModal from './Modals/UpdateCarreraModal';
import UpdateMateriaModal from './Modals/UpdateMateriaModal';
import Notification from './Notification';
import UpdateLeadModal from './Modals/UpdateLeadModal';

const Info = () => {
  const { data: materias = [], isLoading: isLoadingMaterias, refetch: refetchMaterias } = useGetMateriasQuery();
  const { data: carreras = [], isLoading: isLoadingCarreras, refetch: refetchCarreras } = useGetCarrerasQuery();
  const { data: personas = [], isLoading: isLoadingPersonas, refetch: refetchPersonas } = useGetPersonasQuery();
  const { data: leads = [], isLoading: isLoadingLeads, refetch: refetchLeads } = useGetLeadsQuery();

  const [updatePersona] = useUpdatePersonaMutation();
  const [updateLead] = useUpdateLeadMutation();
  const [deletePersona] = useDeletePersonaMutation();
  const [updateMateria] = useUpdateMateriaMutation();
  const [deleteMateria] = useDeleteMateriaMutation();
  const [updateCarrera] = useUpdateCarreraMutation();
  const [deleteCarrera] = useDeleteCarreraMutation();
  const [deleteLead] = useDeleteLeadMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentMethod, setCurrentMethod] = useState(null);

  const [searchLeads, setSearchLeads] = useState('');
  const [searchPersonas, setSearchPersonas] = useState('');
  const [searchCarreras, setSearchCarreras] = useState('');
  const [searchMaterias, setSearchMaterias] = useState('');

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null); 
  const [updateMethod, setUpdateMethod] = useState(null); 
  const [entityType, setEntityType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = (id, type) => {
    let entity;
    switch (type) {
      case 'persona':
        entity = personas.items.find((p) => p.id === id);
        setUpdateMethod(() => updatePersona);
        break;
      case 'carrera':
        entity = carreras.items.find((c) => c.id === id);
        setUpdateMethod(() => updateCarrera);
        break;
      case 'lead':
        entity = leads.items.find((c) => c.id === id);
        setUpdateMethod(() => updateLead);
        break;
      case 'materia':
        entity = materias.items.find((m) => m.id === id);
        setUpdateMethod(() => updateMateria);
        break;
      default:
        break;
    }

    setSelectedEntity(entity);
    setEntityType(type);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (id, updatedData) => {
    if (updateMethod) {
      await updateMethod({ id, data: updatedData });
      if (entityType === 'persona') {
        refetchPersonas();
      } else if (entityType === 'carrera') {
        refetchCarreras();
      } else if (entityType === 'lead') {
        refetchLeads(); 
      } else if (entityType === 'materia') {
        refetchMaterias();
      }
      setIsUpdateModalOpen(false);
      setSuccessMessage(`${entityType} actualizada con éxito`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  

  const handleOpenDeleteModal = (method, id) => {
    setCurrentMethod(() => method);
    setCurrentId(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentMethod) {
      await currentMethod(currentId);
      if (currentMethod === deleteLead) {
        refetchLeads();
      } else if (currentMethod === deletePersona) {
        refetchPersonas();
      } else if (currentMethod === deleteCarrera) {
        refetchCarreras();
      } else if (currentMethod === deleteMateria) {
        refetchMaterias();
      }
      setIsModalOpen(false);
    }
  };

  const getPersonaName = (personaId) => {
    const persona = personas?.items?.find((p) => p.id === personaId);
    return persona ? persona.name : 'Unknown';
  };

  const getMateriaName = (materiaId) => {
    const materia = materias?.items?.find((m) => m.id === materiaId);
    return materia ? materia.name : 'Unknown';
  };

  const getCarreraName = (carreraId) => {
    const carrera = carreras?.items?.find((c) => c.id === carreraId);
    return carrera ? carrera.name : 'Unknown';
  };

  if (isLoadingMaterias || isLoadingCarreras || isLoadingPersonas || isLoadingLeads) {
    return <div>Loading...</div>;
  }

  return (
    <div className="info-container">
      <h1>Info</h1>

      {successMessage && (
        <Notification 
          message={successMessage}
          onClose={() => setSuccessMessage('')} 
        />
      )}

      <h2>Leads</h2>
      <FilterInput value={searchLeads} onChange={setSearchLeads} placeholder="Buscar leads..." />
      <Table 
        data={leads?.items} 
        search={searchLeads} 
        personas={personas?.items} 
        carreras={carreras?.items} 
        columns={[
          { key: 'id', label: 'ID' },
          { 
            key: 'persona_id', 
            label: 'Persona', 
            render: (lead) => getPersonaName(lead.persona_id) 
            },
            { 
              key: 'carrera_id', 
              label: 'Carrera', 
              render: (lead) => getCarreraName(lead.carrera_id) 
              },
              { 
                key: 'materias_ids', 
                label: 'Materias', 
                render: (lead) => (
                  <div>
                {lead.materias_ids.map(m => (
                  <div key={m.materia_id}>
                    {getMateriaName(m.materia_id)} - Año: {m.year_of_inscription}, Veces cursadas: {m.attendance_times}
                  </div>
                ))}
              </div>
            )
            },
            ]}
        onUpdate={(id) => handleUpdate(id, 'lead')}
        onDelete={(id) => handleOpenDeleteModal(deleteLead, id)}
      />

      <h2>Personas</h2>
      <FilterInput value={searchPersonas} onChange={setSearchPersonas} placeholder="Buscar personas..." />
      <Table 
        data={personas.items} 
        search={searchPersonas}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'first_name', label: 'Apellido' },
          { key: 'dni', label: 'DNI' },
          { key: 'email', label: 'Email' },
        ]}
        onUpdate={(id) => handleUpdate(id, 'persona')}
        onDelete={(id) => handleOpenDeleteModal(deletePersona, id)}
      />

      <h2>Carreras</h2>
      <FilterInput value={searchCarreras} onChange={setSearchCarreras} placeholder="Buscar carreras..." />
      <Table 
        data={carreras.items} 
        search={searchCarreras} 
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nombre' },
        ]}
        onUpdate={(id) => handleUpdate(id, 'carrera')}
        onDelete={(id) => handleOpenDeleteModal(deleteCarrera, id)}
      />

      <h2>Materias</h2>
      <FilterInput value={searchMaterias} onChange={setSearchMaterias} placeholder="Buscar materias..." />
      <Table 
        data={materias.items} 
        search={searchMaterias} 
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'duration', label: 'Duración' },
        ]}
        onUpdate={(id) => handleUpdate(id, 'materia')}
        onDelete={(id) => handleOpenDeleteModal(deleteMateria, id)}
      />

{entityType === 'persona' && (
        <UpdatePersonaModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          entity={selectedEntity} 
          onUpdate={handleUpdateSubmit} 
        />
      )}

      {entityType === 'carrera' && (
        <UpdateCarreraModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          entity={selectedEntity} 
          onUpdate={handleUpdateSubmit} 
        />
      )}

      {entityType === 'materia' && (
        <UpdateMateriaModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          entity={selectedEntity} 
          onUpdate={handleUpdateSubmit} 
        />
      )}

      {entityType === 'lead' && (
        <UpdateLeadModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          entity={selectedEntity} 
          onUpdate={handleUpdateSubmit} 
          materias={materias}
        />
      )}

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default Info;
