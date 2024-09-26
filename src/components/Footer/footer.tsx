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
          <p className="collaboration-text">Plataforma desarrollada en colaboración de</p>
          <div className="main-collaborator-logo">
            <img src="https://s3-alpha-sig.figma.com/img/e4a1/b88e/c99379452635912123e99d8a45affdad?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hd1wx-oMB~UdVH3DmIEK3fn4fp91qCXdDNnlN96PgGW7icjAtdd0Kae2i~dG3M79Ykp7IafCqCGJCOVLkiosLp~IsNomCpk08q4VnRo4V5LYMd1xk4x-bKjH~U7IRjhdY3ZuI1AR3Nv-ggeNIvljwGrV12JSbFVM6ebt8Oefo5mI5R0t~GZsD7tl88RyHVQeTzshNZGv66tS7nnROQE2N5gj9Lm9d2wmHYnnqmNE7dlvVXzRUikMU4XqIGVrmID2QQ0onXuZY5wBanU8lWcfkV66OKeCiqUnmeiuk1Q-LaPBOF7Qb2mvcUjwggCqRnY0HnVM89Y35IfCxFgMd0fzcg__" alt="Main Collaborator" />
          </div>
        </div>
        <div className="footer-bottom-row">
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
