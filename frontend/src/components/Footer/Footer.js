import React from 'react';
import { FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p>© 2025 VanishInk. All rights reserved | Made with <FaHeart className="heart-icon" /> by Aslam</p>
        </div>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/aslamsayyad02/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span className="separator">|</span>
          <a href="https://github.com/aslams2020" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;