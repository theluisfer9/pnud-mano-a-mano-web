// Navbar.tsx
import "./navbar.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import LogoGobierno from "@/assets/navbar/logo_gob.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano.png";

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const navigate = useNavigate();
  return (
    <div className="navbar-wrapper">
      {" "}
      {/* New wrapper */}
      <nav className="navbar">
        <div className="navbar-left">
          <img
            src={LogoGobierno}
            alt="Left Logo"
            className="navbar-logo-left"
          />
        </div>
        <div className="navbar-center">
          <ul className="navbar-menu button-container">
            <li>
              <a
                href="#manamano"
                className={activeSection === "home" ? "active" : ""}
                onClick={() => navigate("/")}
              >
                MANO A MANO
              </a>
            </li>
            <li>
              <a
                href="#noticias"
                className={activeSection === "noticias" ? "active" : ""}
                onClick={() => navigate("/noticias")}
              >
                NOTICIAS
              </a>
            </li>
            <li>
              <a href="#informacion" className="disabled" aria-disabled>
                INFORMACIÓN PÚBLICA
              </a>
            </li>
            <li>
              <a href="#datosabiertos" className="disabled" aria-disabled>
                DATOS ABIERTOS
              </a>
            </li>
            <li>
              <a
                href="#iniciarsesion"
                className={activeSection === "login" ? "active" : ""}
                onClick={() => navigate("/login")}
              >
                INICIAR SESIÓN
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <img
            src={LogoManoAMano}
            alt="Right Logo"
            className="navbar-logo-right"
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
