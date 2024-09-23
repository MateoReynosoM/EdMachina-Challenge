import { useState } from 'react';

const useSort = (data, sortableKeys) => {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  
    if (!data || data.length === 0) {
      return { sortedData: [], requestSort: () => {}, sortConfig };
    }
  
    const sortedData = [...data].sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  
    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    return { sortedData, requestSort, sortConfig };
  };
  

export default useSort;
