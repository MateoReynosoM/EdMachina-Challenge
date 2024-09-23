import UpdateEntityModal from './UpdateEntityModal';

const UpdateMateriaModal = (props) => {
  const materiaFields = [
    { name: 'name', label: 'Nombre de la Materia', required: true, minLength: 1, maxLength: 50, errorMessage: 'El nombre debe tener entre 1 y 50 caracteres.' },
    { name: 'duration', label: 'Año de Inscripción', type: 'number', required: true, errorMessage: 'Debe ser un número mayor a 0.' },
  ];

  return (
    <UpdateEntityModal
      {...props}
      fields={materiaFields}
      entityName="Materia"
    />
  );
};

export default UpdateMateriaModal;
