import React from "react";
import "./footer.css";
import PnudLogo from "@/assets/footer/pnud_logo.png";
interface LogoProps {
  src: string;
  alt: string;
}

const Footer: React.FC<{ logos: LogoProps[] }> = ({ logos }) => {
  return (
    <footer className="footer">
      <div className="footer-inner-container">
        <div className="footer-top-row">
          {logos.map((logo, index) => (
            <div key={index} className="footer-logo">
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
        <div className="footer-bottom-row">
          <p className="collaboration-text text-[16px]">
            El desarrollo técnico de esta plataforma ha sido posible gracias al
            apoyo de
          </p>
          <div className="main-collaborator-logo">
            <img src={PnudLogo} alt="Main Collaborator" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
