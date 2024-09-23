import UpdateEntityModal from './UpdateEntityModal';

const UpdateCarreraModal = (props) => {
  const carreraFields = [
    { name: 'name', label: 'Nombre de la Carrera', required: true, minLength: 1, maxLength: 50, errorMessage: 'El nombre debe tener entre 1 y 50 caracteres.' },
  ];

  return (
    <UpdateEntityModal
      {...props}
      fields={carreraFields}
      entityName="Carrera"
    />
  );
};

export default UpdateCarreraModal;
