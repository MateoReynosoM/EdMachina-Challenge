import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Info from './components/Info';
import CrearLeads from './components/CreateLead'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Info />} />
          <Route path="/create-lead" element={<CrearLeads />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
