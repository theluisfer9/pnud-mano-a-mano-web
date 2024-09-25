import "./add-news.css";
import React, {
  ChangeEvent,
  RefObject,
  useContext,
  useRef,
  useState,
} from "react";
import logoutIcon from "@/assets/box-arrow-bg.svg";
import sampleNews from "../../../data/news";
import type { News } from "../../../data/news";
import NewsCard from "../../../components/News-Card/newscard";
import { useNavigate } from "react-router-dom";
import { NewsContext } from "../../../context/newscontext";
import SingleNews from "../../individual-news/news";

const AddNews: React.FC = () => {
  const loggedUser = localStorage.getItem("mano-a-mano-token");
  let parsedUser = loggedUser ? JSON.parse(loggedUser) : null;
  const navigate = useNavigate();
  if (!parsedUser) {
    console.log(loggedUser);
    //navigate("/login");
    parsedUser = {
      name: "Admin",
      role: "news-editor",
      pictureUrl:
        "https://pbs.twimg.com/media/DjjbXfdW4AEu7Uk?format=jpg&name=medium",
    };
  }
  const [currentStep, setCurrentStep] = useState(0);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSubtitle, setNewsSubtitle] = useState("");
  const [mainBody, setMainBody] = useState("");
  const [additionalSections, setAdditionalSections] = useState([
    { image: "", body: "" },
    { image: "", body: "" },
    { image: "", body: "" },
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [externalLinks, setExternalLinks] = useState<string[]>([]);
  const [previewSrc, setPreviewSrc] = useState("");
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const secondaryFileInputRefs: RefObject<HTMLInputElement>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [currentNews, setCurrentNews] = useState<News | null>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  // Handle main image file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Use optional chaining in case files is undefined
    if (file) {
      // Create a URL for the selected file
      const fileURL = URL.createObjectURL(file);
      setPreviewSrc(fileURL);
    }
  };

  // Handle secondary image div click (no type change needed as it's well defined already)
  const handleSecondaryDivClick = (index: number) => {
    secondaryFileInputRefs[index].current?.click();
  };

  // Handle secondary image file change
  const handleSecondaryFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files?.[0]; // Use optional chaining in case files is undefined
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setAdditionalSections((prev) => {
        const newSections = [...prev];
        newSections[index].image = fileURL;
        return newSections;
      });
    }
  };
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("AddNews must be used within a NewsProvider");
  }
  const { addNewsItem, publishNews } = context;

  const handleContinue = (newsToBePublished: News) => {
    addNewsItem(newsToBePublished);
  };
  const handlePublish = (id: number) => {
    publishNews(id);
    navigate("/noticias");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            <div className="avatar">
              <img src={parsedUser.pictureUrl} alt="User Avatar" />
            </div>
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
          {currentStep === 0 ? (
            <form>
              <div className="add-news-title">
                <div className="info-icon"></div>
                <input
                  id="news-title-input"
                  type="text"
                  placeholder="Editar titulo de noticia"
                  onChange={(e) => setNewsTitle(e.target.value)}
                />
              </div>
              <div>
                <div className="main-image-upload" onClick={handleDivClick}>
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="image-preview"
                    />
                  ) : (
                    <span>
                      +<br />
                      Fotografía de encabezado
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="subtitle">
                <input
                  id="news-subtitle-input"
                  type="text"
                  placeholder="Editar subtítulo de noticia"
                  onChange={(e) => setNewsSubtitle(e.target.value)}
                />
                <input
                  id="news-body-input"
                  type="text"
                  placeholder="Ingresar cuerpo de texto aquí"
                  onChange={(e) => setMainBody(e.target.value)}
                />
              </div>
              {[0, 1, 2].map((index) => (
                <div key={index} className="secondary-content">
                  <div
                    className="secondary-image-upload"
                    onClick={() => handleSecondaryDivClick(index)}
                  >
                    {additionalSections[index].image ? (
                      <img
                        src={additionalSections[index].image}
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : (
                      <span className="image-placeholder">
                        +<br />
                        Fotografía secundaria
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={secondaryFileInputRefs[index]}
                    onChange={(e) => handleSecondaryFileChange(e, index)}
                    style={{ display: "none" }}
                  />
                  <textarea
                    className="secondary-textarea"
                    placeholder="Ingresar cuerpo de texto adicional aquí"
                    onChange={(e) => {
                      setAdditionalSections((prev) => {
                        const newSections = [...prev];
                        newSections[index].body = e.target.value;
                        return newSections;
                      });
                    }}
                  ></textarea>
                </div>
              ))}
              <hr />
              <div className="additional-info">
                <h3>Información adicional:</h3>
                <div className="tags">
                  <label>Añadir etiquetas:</label>
                  <input
                    type="text"
                    placeholder="Agregar una etiqueta"
                    onChange={(e) => {
                      setTags(e.target.value.split(","));
                    }}
                  />
                </div>
                <div className="external-links">
                  <label>Añadir enlaces externos:</label>
                  <input
                    type="text"
                    placeholder="Agregar un link"
                    onChange={(e) => {
                      setExternalLinks(e.target.value.split(" "));
                    }}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="save-draft">
                  Guardar como borrador
                </button>
                <button
                  type="submit"
                  className="publish"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep(1);
                    const newsToSave: News = {
                      title: newsTitle,
                      subtitle: newsSubtitle,
                      mainBody: mainBody,
                      mainImage: previewSrc,
                      additionalSections: additionalSections,
                      tags: tags,
                      externalLinks: externalLinks,
                      area: "Area",
                      date: new Date().toDateString(),
                      id: sampleNews.length + 1,
                      state: "draft",
                    };
                    handleContinue(newsToSave);
                    setCurrentNews(newsToSave);
                  }}
                >
                  Continuar con la noticia
                </button>
              </div>
            </form>
          ) : (
            <div className="review-news-container">
              <h3>Visualización de la noticia</h3>
              <NewsCard
                area={currentNews?.area || "Not found"}
                imageUrl={currentNews?.mainImage || ""}
                title={currentNews?.title || ""}
                key={currentNews?.id}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
              {isModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>Visualización previa de la noticia</h2>
                      <button
                        className="close-modal"
                        onClick={() => setIsModalOpen(false)}
                      >
                        &times;
                      </button>
                    </div>
                    <SingleNews news={currentNews || undefined} />
                  </div>
                </div>
              )}
              <div className="preview-buttons">
                <button type="button" className="save-draft">
                  Guardar como borrador
                </button>
                <button
                  type="button"
                  className="publish"
                  onClick={() => {
                    handlePublish(currentNews?.id || -1);
                  }}
                >
                  Publicar noticia
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AddNews;
