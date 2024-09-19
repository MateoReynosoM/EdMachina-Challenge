import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../styles/Modals.css';

const CreateCarreraModal = ({ isOpen, onClose, onCreateCarrera, isLoading, createError }) => {
    const [newCarrera, setNewCarrera] = useState('');
    const [errors, setErrors] = useState('');

    const handleCreateCarrera = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setErrors('');
    if (!newCarrera) {
        setErrors('El campo es obligatorio.');
        return;
    }
    try {
        await onCreateCarrera(newCarrera);
        setNewCarrera('');
        if(!createError){
            onClose();
        }
    } catch (err) {
        console.error('Error al crear la carrera:', err);
    }
};


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="custom-modal"
            overlayClassName="custom-modal-overlay"
        >
            <div className="modal-header">
                <h2>Crear Carrera</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <form onSubmit={handleCreateCarrera}>
                <div>
                    <label>Nombre de la Carrera</label>
                    <input
                        type="text"
                        value={newCarrera}
                        onChange={(e) => setNewCarrera(e.target.value)}
                        placeholder="Nombre de la carrera"
                    />
                    {errors && <div className="error-message">{errors}</div>}
                </div>
                <button type="submit" disabled={isLoading}>
                    Crear Carrera
                </button>
                {createError && <div className="error-message">Error: {createError?.data?.detail}</div>}
            </form>
        </Modal>
    );
};

export default CreateCarreraModal;
