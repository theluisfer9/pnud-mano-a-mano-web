// Navbar.tsx
import "./navbar.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import LogoGobierno from "@/assets/navbar/logo_gob.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    // First check if we're already on the home page
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If not on home page, navigate first then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  const scrollToSectionNoticias = (sectionId: string) => {
    navigate(`/noticias?section=${sectionId}`);
  };

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
            <li className="dropdown">
              <a
                href="#manamano"
                className={activeSection === "home" ? "active" : ""}
                onClick={() => navigate("/")}
              >
                MANO A MANO
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a onClick={() => scrollToSection("dimensiones")}>
                    Dimensiones de trabajo
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("manoamano")}>
                    Mano a Mano
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("lugares")}>
                    Lugares de trabajo
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("registro")}>
                    Registro Social de Hogares
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a
                href="#noticias"
                className={activeSection === "noticias" ? "active" : ""}
                onClick={() => navigate("/noticias")}
              >
                NOTICIAS
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a onClick={() => scrollToSectionNoticias("Noticias")}>
                    Noticias
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSectionNoticias("Historias_de_vida")}
                  >
                    Historias de Vida
                  </a>
                </li>
                <li>
                  <a
                    onClick={() =>
                      scrollToSectionNoticias("Comunicados_de_prensa")
                    }
                  >
                    Comunicados de prensa
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSectionNoticias("Boletines")}>
                    Boletines
                  </a>
                </li>
              </ul>
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
