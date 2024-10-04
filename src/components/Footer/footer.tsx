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
        <div className="footer-top-row">
          {logos.map((logo, index) => (
            <div key={index} className="footer-logo">
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
        <div className="footer-bottom-row">
          <p className="collaboration-text">
            <strong>
              La plataforma fue desarrollada con la colaboración de
            </strong>
          </p>
          <div className="main-collaborator-logo">
            <img
              src="https://s3-alpha-sig.figma.com/img/eabf/0d24/2ea143febd760fb064f11b9d6b7da0b7?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DCY9y~22HESWAYh~hGZtlJETPyMw0eiV-eG36n9EnXqzUyR8CCtM0DvIQFKPIfwcW9KBcPrMeClmyIhqgCuklb8mL6jVWKAX-ctEZRSHCDbDKxrM5N3xA63ZuhMdtL3mV8-BMTK6OQDrlcj9UNwn3cO5bgLKPNSnFjf40ZkHFwBJp6aOK49oCK0SCq91e4x-4v79p2LCemUdHW8VRfDYCF68Lkq8iRvbteOz~udm41zj5zPweX-K1Y-ICv4xF0SaOOidV9hRjY1dMXD5VXCz1X2NcKSY0hAX2Ae9nzjG9deQmErJ~1Ccsmz~F6hsFdpn4XWWulYrW5ZvmUcGyIYUew__"
              alt="Main Collaborator"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
