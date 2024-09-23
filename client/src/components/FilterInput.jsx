import React from 'react';

const FilterInput = ({ value, onChange, placeholder }) => {
  return (
    <input
    style={input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

 const input = {
  marginBottom: '15px',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
}


export default FilterInput;
