import "./add-news.css";
import React, {
  ChangeEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LogoutIcon from "@/assets/add-news/box-arrow-left.svg";
import sampleNews from "../../../data/news";
import type { News } from "../../../data/news";
import NewsCard from "../../../components/News-Card/newscard";
import { useNavigate } from "react-router-dom";
import { NewsContext } from "../../../context/newscontext";
import SingleNews from "../../individual-news/news";
import { TagInput } from "@/components/TagInput/taginput";
import { ITag } from "@/hooks/useTagInput";
import LogoGobierno from "@/assets/navbar/logo_gob_add_new.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano.png";
import { Combobox } from "@/components/Combobox/combobox";
const AddNews: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const loggedUser = localStorage.getItem("mano-a-mano-token");
    if (!loggedUser) {
      //navigate("/login");
    }
  }, [navigate]);
  const parsedUser = JSON.parse(
    localStorage.getItem("mano-a-mano-token") || "{}"
  );
  if (Object.keys(parsedUser).length === 0) {
    //navigate("/login");
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

  const [tags, setTags] = useState<ITag[]>([]);
  const [value, setValue] = useState<string>("");
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
    index: number
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [mainBody]);

  const handleMainBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 1800);
    setMainBody(text);
  };

  return (
    <div className="news-editor">
      <aside>
        <div className="user-profile">
          <div className="avatar">
            <img src={parsedUser.pictureUrl} alt="User Avatar" />
          </div>
          <div className="user-info">
            <h2>{parsedUser.name}</h2>
            <p className="user-role">{parsedUser.role}</p>
          </div>
        </div>
        <button className="logout-button">
          <span className="logout-icon">
            <LogoutIcon />
          </span>
          <a
            href="#"
            className="logout-text"
            onClick={() => {
              localStorage.removeItem("mano-a-mano-token");
              window.location.href = "/login";
            }}
          >
            Cerrar Sesión
          </a>
        </button>
      </aside>
      <div className="content-wrapper">
        <header>
          <div className="header-container">
            <div className="logo-placeholder">
              <img src={LogoGobierno} alt="Logo gobierno" />
            </div>
            <div className="logo-placeholder">
              <img src={LogoManoAMano} alt="Logo mano a mano" />
            </div>
          </div>
        </header>
        <main>
          <section className="content">
            <nav className="stepper-nav">
              <button
                className={`stepper-button ${
                  currentStep === 0 ? "active" : ""
                }`}
              >
                <span className="stepper-circle"></span>
                <span className="stepper-text">Nueva noticia</span>
              </button>
              <button
                className={`stepper-button ${
                  currentStep === 1 ? "active" : ""
                }`}
              >
                <span className="stepper-circle"></span>
                <span className="stepper-text">Publicación</span>
              </button>
            </nav>
            {currentStep === 0 ? (
              <form>
                <div className="add-news-title">
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
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="subtitle mb-[32px]">
                  <input
                    id="news-subtitle-input"
                    type="text"
                    placeholder="Editar subtítulo de noticia"
                    onChange={(e) => setNewsSubtitle(e.target.value)}
                  />
                  <textarea
                    id="news-body-input"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 1800 caracteres)"
                    onChange={handleMainBodyChange}
                    value={mainBody}
                    maxLength={1800}
                  />
                </div>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col gap-4 w-full">
                    <textarea
                      className="secondary-textarea border-[1px] border-[#aeb4c1] rounded-sm p-2 resize-vertical"
                      placeholder="Ingresar cuerpo de texto adicional aquí (máximo 900 caracteres)"
                      maxLength={900}
                      onChange={(e) => {
                        const adjustTextareaHeight = (
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          e.target.style.height = "auto";
                          e.target.style.height =
                            20 + e.target.scrollHeight + "px";
                          // This should also adjust the height of the upload image
                          const uploadImage =
                            document.querySelector<HTMLDivElement>(
                              `.secondary-image-upload-${index}`
                            );
                          console.log(uploadImage);

                          if (uploadImage) {
                            uploadImage.style.height = "1px";
                            uploadImage.style.height =
                              20 + e.target.scrollHeight + "px";
                          }
                        };
                        adjustTextareaHeight(e);
                        setAdditionalSections((prev) => {
                          const newSections = [...prev];
                          newSections[index].body = e.target.value.slice(
                            0,
                            900
                          );
                          return newSections;
                        });
                      }}
                      value={additionalSections[index].body}
                    ></textarea>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={secondaryFileInputRefs[index]}
                      onChange={(e) => handleSecondaryFileChange(e, index)}
                      style={{ display: "none" }}
                    />
                    <div
                      className={`secondary-image-upload secondary-image-upload-${index} w-full my-[32px] h-[128px]`}
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
                  </div>
                ))}
                <hr />
                <div className="additional-info">
                  <h3>Información adicional:</h3>
                  <div className="tags mt-[16px] mb-[24px]">
                    <label>Añadir etiquetas:</label>
                    <TagInput
                      value={value}
                      onChangeValue={setValue}
                      tags={tags}
                      onChangeTags={setTags}
                      showEdit
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
                  <button
                    type="button"
                    className="go-back"
                    onClick={() => navigate("/noticias")}
                  >
                    Regresar
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
              <div className="review-news-container p-[32px]">
                <h3 className="mb-[32px]">Visualización de la noticia</h3>
                <div className="flex flex-row justify-center items-center w-full">
                  <div className="w-[40%]">
                    <NewsCard
                      area={currentNews?.area || "Not found"}
                      imageUrl={currentNews?.mainImage || ""}
                      title={currentNews?.title || ""}
                      key={currentNews?.id}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-[24px] justify-center items-center w-[60%]">
                    <div className="flex w-full justify-center items-center">
                      <Combobox
                        options={[
                          {
                            label: "Ministerio de Educación",
                            value: "Educación",
                          },
                          { label: "Ministerio de Salud", value: "Salud" },
                        ]}
                        placeholder="Ministerio"
                        width="full"
                        popOverWidth="full"
                      />
                    </div>
                  </div>
                </div>
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
                  <button
                    type="button"
                    className="go-back"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Regresar
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
    </div>
  );
};

export default AddNews;
