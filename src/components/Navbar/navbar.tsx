// Navbar.tsx
import React from "react";
import "./navbar.css"; // Import the CSS file for styling
import logoLeft from "@/assets/logo_gobierno.png"; // Replace with the actual path to your image
import logoRight from "@/assets/logo_mano_a_mano.png"; // Replace with the actual path to your image

const Navbar: React.FC = () => {
  return (
    <div className="navbar-wrapper">
      {" "}
      {/* New wrapper */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logoLeft} alt="Left Logo" className="navbar-logo-left" />
        </div>
        <div className="navbar-center">
          <ul className="navbar-menu button-container">
            {" "}
            {/* Add 'button-container' class */}
            <li>
              <a href="#manamano" className="active">
                MANO A MANO
              </a>
            </li>
            <li>
              <a href="#noticias">NOTICIAS</a>
            </li>
            <li>
              <a href="#iniciarsesion">INICIAR SESIÓN</a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <img src={logoRight} alt="Right Logo" className="navbar-logo-right" />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
