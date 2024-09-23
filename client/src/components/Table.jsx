import React from 'react';
import useSort from './useSort';
import { FaEdit, FaTrash } from 'react-icons/fa';


const Table = ({ data, search, columns, materias, onUpdate, onDelete }) => {
    const { sortedData, requestSort, sortConfig } = useSort(data, columns.map(col => col.key));

    const filteredData = sortedData?.filter(item => {
        return Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(search?.toLowerCase())
        );
    });

    return (
        <table className="info-table">
            <thead>
                <tr>
                    {columns.map(column => (
                        <th key={column.key} onClick={() => requestSort(column.key)}>
                            {column.label} {sortConfig.key === column.key ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : null}
                        </th>
                    ))}
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
  {filteredData.length === 0 ? (
    <tr>
      <td colSpan={columns?.length + 1 || 1} style={{ textAlign: 'center' }}>
        No hay registros disponibles.
      </td>
    </tr>
  ) : (
    filteredData.map(item => (
      <tr key={item.id}>
        {columns.map(column => (
          <td key={column.key}>
            {column.render ? column.render(item, materias) : item[column.key]}
          </td>
        ))}
        <td style={{ width: '100px', textAlign: 'center' }}>
  <button onClick={() => onUpdate(item.id)}>
    <FaEdit title="Actualizar" style={{ color: 'blue', fontSize: '1.5rem' }} />
  </button>
  <button onClick={() => onDelete(item.id)}>
    <FaTrash title="Eliminar" style={{ color: 'red', fontSize: '1.5rem' }} />
  </button>
</td>
      </tr>
    ))
  )}
</tbody>

        </table>
    );
};

export default Table