// Navbar.tsx
import React, { useState } from "react";
import "./navbar.css"; // Import the CSS file for styling
import logoLeft from "@/assets/logo_gobierno.png"; // Replace with the actual path to your image
import logoRight from "@/assets/logo_mano_a_mano.png"; // Replace with the actual path to your image

interface NavbarProps {
  onNavClick: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [activeSection, setActiveSection] = useState("home");
  const handleNavClick = (section: string) => {
    setActiveSection(section);
    onNavClick(section);
  };
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
            <li>
              <a
                href="#manamano"
                className={activeSection === "home" ? "active" : ""}
                onClick={() => handleNavClick("home")}
              >
                MANO A MANO
              </a>
            </li>
            <li>
              <a
                href="#noticias"
                className={activeSection === "noticias" ? "active" : ""}
                onClick={() => handleNavClick("noticias")}
              >
                NOTICIAS
              </a>
            </li>
            <li>
              <a
                href="#iniciarsesion"
                className={activeSection === "login" ? "active" : ""}
                onClick={() => handleNavClick("login")}
              >
                INICIAR SESIÓN
              </a>
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
