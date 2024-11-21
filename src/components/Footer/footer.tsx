import React from "react";
import "./footer.css";
import PnudLogo from "@/assets/footer/pnud_logo.png";
interface LogoProps {
  src: string;
  alt: string;
}

const Footer: React.FC<{ logos: LogoProps[] }> = ({ logos }) => {
  const alphabeticallySortedLogos = logos.sort((a, b) =>
    a.alt.localeCompare(b.alt)
  );
  return (
    <footer className="footer">
      <div className="footer-inner-container">
        <div className="footer-top-row mobile:grid mobile:grid-cols-5 mobile:items-center mobile:justify-center mobile:px-4">
          {alphabeticallySortedLogos.map((logo, index) => (
            <div key={index} className="footer-logo">
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
        <div className="footer-bottom-row">
          <p className="collaboration-text text-[16px] mobile:px-4 mobile:text-center mobile:text-[8px]">
            El desarrollo técnico de esta plataforma ha sido posible gracias al
            apoyo de
          </p>
          <div className="main-collaborator-logo">
            <img src={PnudLogo} alt="Main Collaborator" className="mobile:w-8 mobile:h-16"/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
