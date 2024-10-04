// Navbar.tsx
import "./navbar.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

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
          <img src="https://s3-alpha-sig.figma.com/img/e295/22c3/11b7eda614cbe21da7ae01e1b41b2363?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RmziLd5VJ9UT5O5Hs8ctyTBcHO3R06UImAgMhJDGQaWArYa0f5pY3M34N2pLVuWO9fBb73sSgKu0rchWZ7-xpqHhnjppfHuPND3IUJoCJkQZUdHZmO2yg7jnnDnRn0WyzsmPqu5cxSdB-u0eprmyDsPIxjloG~st0U50puVxe43DY2uUjD0Uk22PT3Dmb8rqsILsyo5tadc0rcFAu0DnGT~bCds7GUHFfjzdfl-r1~KiWKquSCUhlRw6ps6ri8HNxwAMk0GZnQJw9lutZb-xjwvLKvtNcAf6vMHqt2Ifg51q0yp87fQDiAooKYvjnAJX1QzxYbkx2LQVbsuh-tbhmA__" alt="Left Logo" className="navbar-logo-left" />
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
          <img src="https://s3-alpha-sig.figma.com/img/6060/d61a/3aa2948143dd357660e2c4b1c992dadb?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D8Dvo5ESgk-4xYJmuJzM~f3zAl5dx52rM1nXXkEq4eGfkB-Ja6Gc7qPjOaTwM~R0ShOUR5HvV2K40JJHNRfrmDR0UjoScV4bULQ1Laf1pc0NbGctmE4lm6O72R23lyvQBTFbfOdg0Iyn6Yzi3S1Hm6EFqT2mVr5JIUlv82Wk7LftarE2QEocjz62D6AB1KfUWtCoOuNeO6zvvy1EVmcFwZkJEwgw7Io3clmlbO9WRxxCOuMtA4f4GLIqtS5RXYXXBDmtdBt0twe~vYM3H~rAI-r6KWuoGwNPB9swHGay-y09b~83OjJeQ7IxxSvZz6Oy-vnIFvZHf2a28eOd2mbYPg__" alt="Right Logo" className="navbar-logo-right" />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
