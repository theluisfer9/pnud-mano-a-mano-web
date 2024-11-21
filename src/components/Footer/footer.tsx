import React from "react";
import "./footer.css";
import PnudLogo from "@/assets/footer/pnud_logo.png";
import FooterCarousel from "../Footer-Carousel/carousel";
import { useRenderMobileOrDesktop } from "@/utils/functions";

interface LogoProps {
  src: string;
  alt: string;
}

const Footer: React.FC<{ logos: LogoProps[] }> = ({ logos }) => {
  const { isWindowPhone } = useRenderMobileOrDesktop();
  const alphabeticallySortedLogos = logos.sort((a, b) =>
    a.alt.localeCompare(b.alt)
  );

  return (
    <footer className="footer">
      <div className="footer-inner-container">
        <div className="footer-top-row">
          {isWindowPhone ? (
            <FooterCarousel logos={alphabeticallySortedLogos} />
          ) : (
            <div className="grid grid-cols-5 items-center justify-center px-4 w-full gap-4">
              {alphabeticallySortedLogos.map((logo, index) => (
                <div key={index} className="footer-logo">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="footer-bottom-row">
          <p className="collaboration-text text-[16px] mobile:px-4 mobile:text-center mobile:text-[12px]">
            El desarrollo técnico de esta plataforma ha sido posible gracias al
            apoyo de
          </p>
          <div className="main-collaborator-logo">
            <img
              src={PnudLogo}
              alt="Main Collaborator"
              className="mobile:w-8 mobile:h-18"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
