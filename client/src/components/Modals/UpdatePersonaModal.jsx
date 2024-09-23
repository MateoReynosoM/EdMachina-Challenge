import UpdateEntityModal from './UpdateEntityModal';

const UpdatePersonaModal = (props) => {
  const personaFields = [
    { name: 'name', label: 'Nombre', required: true, minLength: 1, maxLength: 50, errorMessage: 'El nombre debe tener entre 1 y 50 caracteres.' },
    { name: 'first_name', label: 'Apellido', required: true, minLength: 1, maxLength: 50, errorMessage: 'El apellido debe tener entre 1 y 50 caracteres.' },
    { name: 'dni', label: 'DNI', readOnly: true },
    { name: 'email', label: 'Email', type: 'email', readOnly: true },
    { name: 'phone', label: 'Teléfono', errorMessage: 'El teléfono debe tener entre 7 y 15 dígitos y puede comenzar con un +.' },
    { name: 'address', label: 'Dirección' },
  ];

  return (
    <UpdateEntityModal
      {...props}
      fields={personaFields}
      entityName="Persona"
    />
  );
};

export default UpdatePersonaModal;
