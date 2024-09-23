import React from 'react';
import '../../styles/Modals.css';


const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h2>Confirmación de Eliminación</h2>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>
        <p>¿Estás seguro de querer eliminar el registro? Esto puede afectar a los demás registros.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onConfirm} style={{ backgroundColor: '#4636fa', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            Eliminar
          </button>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;