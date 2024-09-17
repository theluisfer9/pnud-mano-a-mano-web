import React from "react";
import "./footer.css";
interface LogoProps {
  src: string;
  alt: string;
}

const Footer: React.FC<{ logos: LogoProps[] }> = ({ logos }) => {
  return (
    <footer className="footer">
      <div className="footer-inner-container">
        <div className="footer-container">
          {logos.map((logo, index) => (
            <div key={index} className="footer-logo">
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
