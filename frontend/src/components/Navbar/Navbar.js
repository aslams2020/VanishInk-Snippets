import React from 'react';
import { FaGithub, FaEnvelope } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ navigateTo }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <a href="/" className='logo-left'><h2>Vanish-Ink</h2></a>
      </div>
      <div className="nav-links">
        <a href="https://github.com/aslams2020/VanishInk-Snippets" target="_blank" rel="noopener noreferrer">
          <FaGithub className="nav-icon" />
        </a>
        <a href="mailto:sayyadaslam2020@gmail.com">
          <FaEnvelope className="nav-icon" />
        </a>
        <span onClick={() => navigateTo('/about')} className="nav-span" style={{ cursor: 'pointer' }}>
          About
        </span>
      </div>
    </nav>
  );
};

export default Navbar;