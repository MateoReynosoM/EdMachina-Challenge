import React from 'react';
import { useGetMateriasQuery, useGetCarrerasQuery, useGetPersonasQuery, useGetLeadsQuery } from '../store/api';
import '../styles/Info.css';

const Info = () => {
  const { data: materias = [], isLoading: isLoadingMaterias } = useGetMateriasQuery();
  const { data: carreras = [], isLoading: isLoadingCarreras } = useGetCarrerasQuery();
  const { data: personas = [], isLoading: isLoadingPersonas } = useGetPersonasQuery();
  const { data: leads = [], isLoading: isLoadingLeads } = useGetLeadsQuery();

  if (isLoadingMaterias || isLoadingCarreras || isLoadingPersonas || isLoadingLeads) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className="info-container">
      <h1>Info</h1>
      <h2>Leads</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Persona</th>
            <th>Carrera</th>
            <th>Materias</th>
          </tr>
        </thead>
        <tbody>
          {leads?.items?.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{getPersonaName(lead.persona_id)}</td>
              <td>{getCarreraName(lead.carrera_id)}</td>
              <td>
                {lead?.materias_ids?.map((materia) => (
                  <div key={materia.materia_id}>
                    {getMateriaName(materia.materia_id)} - Año: {materia.year_of_inscription}, Veces cursadas: {materia.attendance_times}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Personas</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {personas?.items?.map((persona) => (
            <tr key={persona.id}>
              <td>{persona.id}</td>
              <td>{persona.name}</td>
              <td>{persona.first_name}</td>
              <td>{persona.dni}</td>
              <td>{persona.email}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <h2>Carreras</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {carreras?.items?.map((carrera) => (
            <tr key={carrera.id}>
              <td>{carrera.name}</td>
              <td>{carrera.id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Materias</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          {materias?.items?.map((materia) => (
            <tr key={materia.id}>
              <td>{materia.name}</td>
              <td>{materia.duration} años/s</td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
};

export default Info;
