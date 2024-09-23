import "./add-news.css";
import React, { useState } from "react";
import logoutIcon from "@/assets/box-arrow-bg.svg";

const AddNews: React.FC = () => {
  const loggedUser = localStorage.getItem("mano-a-mano-token");
  const parsedUser = loggedUser ? JSON.parse(loggedUser) : null;
  if (!parsedUser) {
    window.location.href = "/login";
  }
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="news-editor">
      <header>
        <div className="header-container">
          <div className="logo-left">
            <div className="logo-placeholder">
              <img
                src="https://s3-alpha-sig.figma.com/img/f5f4/24e0/fce1c62a2daf95a920a31fb0f503f88e?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Yff9plvC-dXTyWwAJeGDVHMp1W22tR6oK8rhXDwMl8dtqcB4OeFDKq3MLTop2KTfeo3ytjNfOVPR77vqVtrNZllhfk4NwMQO7tT~0qTOraOu-aCJ-lyu3eE~uuXwOLpOqI6OARt2kSX9S4FJlca~L3cdrVFHfm0sbW8qunmWOVwdgBYabtYNHElpNQc0siQCLAFmty6J4QZLBkzcglV~ECSYGcXBE8EozIYoClMeczNF5RlRZQCf~hUepMw8BfEluWR2yK4Z5SAw-px5sUebvaHhurF-YS9wwkIiUzWvGBbBq~SVnCrLmaCCtVCkmZnGPSeOTP8OyOi52ebYsT8tHA__"
                alt="ManoMano"
              />
            </div>
          </div>
          <div className="logo-right">
            {/* Replace with actual logo */}
            <div className="logo-placeholder">
              <img
                src="https://s3-alpha-sig.figma.com/img/b966/fd5d/ce8a158bb381438a864e225dca7b4945?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JW-Koiv2uF~V9MMf2SkJ1YrbVnnbJnDQxtrS59lHBSW0DJGSjOEAwrjCTZIu1DRQQ9kR~BAhl5gPOFTggfIQxiEq3QMoSLS8YVp4S~-Ekm5BBu0Pzku80Gf2ghuhdj2N6Uhd4QoSjXhVBlsbQxkeB3989sz4M8sihq8OI4KwGtxA5vAd7VBnmKeQQJz-E2DsrEx6-i~91EXEH3lgCVkqEJ-DDxG4lJdTnzPR3RD~bIBN5nJAxHVAqtB584YmYXD5CsRvSxj8DXoEyHMdsYQDPiVau2A2bd6~6hI2L1UBz5pGsrOONwCqjR~Zkbdv1FvvINNvKRJBOYUVx1vXQz-6LA__"
                alt="ManoMano"
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <aside>
          <div className="user-profile">
            <div className="avatar"></div>
            <div className="user-info">
              <h2>{parsedUser.name}</h2>
              <p>{parsedUser.role}</p>
            </div>
          </div>
          <button className="logout-button">
            <span className="logout-icon">
              <img src={logoutIcon} alt="Logout Icon" />
            </span>
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        </aside>
        <section className="content">
          <nav className="stepper-nav">
            <button
              className={`stepper-button ${currentStep === 0 ? "active" : ""}`}
            >
              <span className="stepper-circle"></span>
              <span className="stepper-text">Nueva noticia</span>
            </button>
            <button
              className={`stepper-button ${currentStep === 1 ? "active" : ""}`}
            >
              <span className="stepper-circle"></span>
              <span className="stepper-text">Nueva noticia</span>
            </button>
          </nav>
          <form>
            <div className="add-news-title">
              <div className="info-icon"></div>
              <h1>Editar título de noticia</h1>
            </div>
            <div className="main-image-upload">
              <span>
                +<br />
                Fotografía de encabezado
              </span>
            </div>
            <div className="subtitle">
              <label>Editar subtítulo de noticia</label>
              <input type="text" placeholder="Ingresar cuerpo de texto aquí" />
            </div>
            {[1, 2, 3].map((index) => (
              <div key={index} className="secondary-content">
                <div className="secondary-image-upload">
                  <span className="image-placeholder">
                    +<br />
                    Fotografía secundaria
                  </span>
                </div>
                <textarea
                  className="secondary-textarea"
                  placeholder="Ingresar cuerpo de texto adicional aquí"
                ></textarea>
              </div>
            ))}
            <hr />
            <div className="additional-info">
              <h3>Información adicional:</h3>
              <div className="tags">
                <label>Añadir etiquetas:</label>
                <input type="text" placeholder="Agregar una etiqueta" />
              </div>
              <div className="external-links">
                <label>Añadir enlaces externos:</label>
                <input type="text" placeholder="Agregar un link" />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="save-draft">
                Guardar como borrador
              </button>
              <button type="submit" className="publish">
                Continuar con la noticia
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddNews;
