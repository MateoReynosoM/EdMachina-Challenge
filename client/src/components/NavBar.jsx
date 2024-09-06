import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link className="navbar-link" to="/">Info</Link>
        </li>
        <li className="navbar-item">
          <Link className="navbar-link" to="/create-lead">Create Lead</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
