import "./add-life-stories.css";
import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import LogoutIcon from "@/assets/add-news/box-arrow-left.svg";
import { useNavigate } from "react-router-dom";
import LogoGobierno from "@/assets/navbar/logo_gob_add_new.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";
import SelectComponent from "@/components/Select/select";
import InfoIcon from "@/assets/information.svg";
import { addLifeStories } from "@/db/queries";
import { LifeStory } from "@/data/lifestories";
import LifeStoryPage from "@/pages/individual-life-story/lifestory";

const AddLifeStories: React.FC = () => {
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
  const [firstAdditionalBody, setFirstAdditionalBody] = useState("");
  const [mainBody, setMainBody] = useState("");
  const [secondAdditionalBody, setSecondAdditionalBody] = useState("");
  const [mainImagePreviewSrc, setMainImagePreviewSrc] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const imageFileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const secondaryFileInputRefs: RefObject<HTMLInputElement>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [currentNews, setCurrentNews] = useState<LifeStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageDivClick = () => {
    imageFileInputRef.current?.click();
  };

  // Handle main video file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewSrc(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle main image file change
  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setMainImagePreviewSrc(base64String);
      };
      reader.readAsDataURL(file);
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
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAdditionalImages((prev) => {
          const newSections = [...prev];
          newSections[index] = base64String;
          return newSections;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (id: number, date: string, area: string) => {
    if (!currentNews) {
      alert("No se ha guardado la noticia");
      return;
    }
    setIsLoading(true); // Start loading
    const updatedNews: LifeStory = {
      ...currentNews,
      id: id,
      date: date,
      program: area,
    };
    await addLifeStories(updatedNews);
    setIsLoading(false); // End loading
    navigate("/dashboard");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstTextareaRef = useRef<HTMLTextAreaElement>(null);
  const secondTextareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [mainBody]);

  useEffect(() => {
    if (firstTextareaRef.current) {
      adjustTextareaHeight(firstTextareaRef.current);
    }
  }, [firstAdditionalBody]);

  useEffect(() => {
    if (secondTextareaRef.current) {
      adjustTextareaHeight(secondTextareaRef.current);
    }
  }, [secondAdditionalBody]);

  const handleMainBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 1800);
    setMainBody(text);
  };
  const handleFirstAdditionalBody = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 700);
    setFirstAdditionalBody(text);
  };
  const handleSecondAdditionalBodyChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value.slice(0, 700);
    setSecondAdditionalBody(text);
  };

  const getAreaNameByValue = (value: string) => {
    switch (value) {
      case "comunicaciones":
        return "MICIVI";
      case "cultura_y_deportes":
        return "MCD";
      case "desarrollo_social":
        return "MIDES";
      case "economia":
        return "MIDECO";
      case "trabajo":
        return "MINTRAB";
      case "agricultura":
        return "MAGA";
      case "educacion":
        return "MINEDUC";
      case "salud":
        return "MSPAS";
      case "defensa":
        return "MINDEF";
      case "energia":
        return "MEM";
      case "sesan":
        return "SESAN";
      default:
        return "Pendiente";
    }
  };

  return (
    <div className="news-editor">
      {isLoading && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cargando...</h2>
            <div className="modal-body">
              <p>Por favor, espere mientras se carga la información.</p>
            </div>
          </div>
        </div>
      )}
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
                <span className="stepper-text">Nueva historia de vida</span>
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
                    placeholder="Editar titulo de historia de vida"
                    onChange={(e) => setNewsTitle(e.target.value)}
                  />
                </div>
                <div>
                  <div className="main-image-upload" onClick={handleDivClick}>
                    {previewSrc ? (
                      <video src={previewSrc} className="image-preview" />
                    ) : (
                      <span>
                        +<br />
                        Video
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="video/mp4"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="subtitle mb-[32px]">
                  <textarea
                    id="news-body-input"
                    ref={firstTextareaRef}
                    placeholder="Editar cuerpo de texto adicional (máximo 700 caracteres)"
                    onChange={(e) => {
                      handleFirstAdditionalBody(e);
                      adjustTextareaHeight(e.target);
                    }}
                    value={firstAdditionalBody}
                    maxLength={700}
                    className="w-full min-h-[100px] p-4 border border-[#aeb4c1] rounded-lg resize-none overflow-hidden"
                    onInput={(e) =>
                      adjustTextareaHeight(e.target as HTMLTextAreaElement)
                    }
                  />
                </div>
                <div className="flex gap-6 justify-between items-center h-[400px] mb-[32px]">
                  <div className="w-1/2 h-[400px]">
                    <div
                      className="main-image-upload"
                      onClick={handleImageDivClick}
                    >
                      {mainImagePreviewSrc ? (
                        <img
                          src={mainImagePreviewSrc}
                          className="main-image-preview"
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
                      ref={imageFileInputRef}
                      onChange={handleImageFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="w-1/2 h-[400px]">
                    <textarea
                      id="news-body-input"
                      ref={textareaRef}
                      placeholder="Editar cuerpo de texto (Mínimo 1450 caracteres)"
                      onChange={handleMainBodyChange}
                      value={mainBody}
                      minLength={1450}
                      maxLength={1800}
                      style={{ minHeight: "400px", maxHeight: "400px" }}
                    />
                  </div>
                </div>
                <div className="subtitle mb-[32px]">
                  <textarea
                    id="news-body-input"
                    ref={secondTextareaRef}
                    placeholder="Editar cuerpo de texto adicional (máximo 700 caracteres)"
                    onChange={handleSecondAdditionalBodyChange}
                    value={secondAdditionalBody}
                    maxLength={700}
                  />
                </div>
                <div className="flex gap-6 justify-between items-center w-full my-8">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="w-[calc(33.33%-16px)]">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={secondaryFileInputRefs[index]}
                        onChange={(e) => handleSecondaryFileChange(e, index)}
                        className="hidden"
                      />
                      <div
                        className="w-full h-[200px] border-2 border-dashed border-[#aeb4c1] rounded-lg cursor-pointer flex flex-col items-center justify-center bg-transparent hover:bg-gray-100 transition-colors"
                        onClick={() => handleSecondaryDivClick(index)}
                      >
                        {additionalImages[index] ? (
                          <img
                            src={additionalImages[index]}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center text-[#505050]">
                            <span className="text-3xl block mb-2">+</span>
                            <span className="text-sm">
                              Fotografía secundaria
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="go-back"
                    onClick={() => navigate("/dashboard")}
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="publish"
                    onClick={(e) => {
                      e.preventDefault();
                      // Check that at least title, video, header image and main body are not empty
                      if (
                        newsTitle === "" ||
                        mainBody === "" ||
                        previewSrc === "" ||
                        mainImagePreviewSrc === ""
                      ) {
                        alert("Por favor, complete todos los campos");
                        return;
                      }
                      setCurrentStep(1);
                      const newsToSave: LifeStory = {
                        title: newsTitle,
                        body: mainBody,
                        headerImage: mainImagePreviewSrc,
                        date: date,
                        id: -1,
                        program: "",
                        videoUrl: previewSrc,
                        additionalImages: additionalImages,
                        firstAdditionalBody: firstAdditionalBody,
                        secondAdditionalBody: secondAdditionalBody,
                      };
                      setCurrentNews(newsToSave);
                    }}
                  >
                    Continuar con la historia de vida
                  </button>
                </div>
              </form>
            ) : (
              <div className="review-news-container p-[32px]">
                <h3 className="mb-[32px]">
                  Visualización de la historia de vida
                </h3>
                <div className="flex flex-row justify-center items-center w-full gap-10">
                  <div className="w-[40%]">
                    <div
                      className="flex-1 h-[400px] relative rounded-[16px] group"
                      style={{
                        backgroundImage: `url(${currentNews?.headerImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-[16px]" />
                      <div className="absolute inset-0 flex flex-col justify-between py-8">
                        <div className="w-full flex justify-center items-center flex-1">
                          <h2 className="text-white text-3xl font-bold text-center px-4">
                            {currentNews?.title}
                          </h2>
                        </div>
                        <div className="w-full px-8">
                          <button
                            onClick={() => {
                              // update currentNews with the date and program
                              const dateParts = date.split("/");
                              const formattedDate = new Date(
                                +dateParts[2],
                                +dateParts[1] - 1,
                                +dateParts[0]
                              );
                              if (!currentNews) {
                                alert("No se ha guardado la noticia");
                                return;
                              }
                              const updatedNews: LifeStory = {
                                ...currentNews,
                                date: formattedDate.toISOString(),
                                id: -1,
                                program: getAreaNameByValue(area),
                              };
                              setCurrentNews(updatedNews);
                              setIsModalOpen(true);
                            }}
                            className="bg-white w-3/5 text-[#1C2851] px-6 py-2 rounded-lg font-medium text-sm cursor-pointer hover:bg-slate-50"
                          >
                            Vista previa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[24px] justify-start items-center w-[60%] h-full">
                    <div className="flex w-full justify-center items-center">
                      <SelectComponent
                        onChange={(value) => setArea(value)}
                        options={[
                          { value: "comunicaciones", label: "MICIVI" },
                          { value: "cultura_y_deportes", label: "MCD" },
                          { value: "desarrollo_social", label: "MIDES" },
                          { value: "economia", label: "MIDECO" },
                          { value: "trabajo", label: "MINTRAB" },
                          { value: "agricultura", label: "MAGA" },
                          { value: "educacion", label: "MINEDUC" },
                          { value: "salud", label: "MSPAS" },
                          { value: "defensa", label: "MINDEF" },
                          { value: "energia", label: "MEM" },
                          { value: "sesan", label: "SESAN" },
                        ]}
                        placeholder="Programa Social"
                        width="full"
                      />
                    </div>
                    <div className="flex w-full justify-center items-center gap-[24px] text-[#667085]">
                      <div
                        id="date-container"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Fecha de publicación:</p>
                        <input
                          type="text"
                          placeholder="dd/mm/aaaa"
                          pattern="\d{2}/\d{2}/\d{4}"
                          maxLength={10}
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          value={date}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 8) value = value.slice(0, 8);
                            if (value.length > 4) {
                              value = `${value.slice(0, 2)}/${value.slice(
                                2,
                                4
                              )}/${value.slice(4)}`;
                            } else if (value.length > 2) {
                              value = `${value.slice(0, 2)}/${value.slice(2)}`;
                            }
                            setDate(value);
                          }}
                        />
                      </div>
                      <div
                        id="hour-container"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Hora de publicación:</p>
                        <input
                          type="time"
                          value={new Date().toLocaleTimeString("en-US", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex w-full justify-start items-center gap-[16px] text-[#667085] bg-[#F3F4F6] rounded-sm p-[16px]">
                      <div className="w-1/15 h-full flex flex-col items-center justify-center">
                        <InfoIcon />
                      </div>
                      <p className="text-[12px]">
                        Puedes programar únicamente la fecha de publicación.
                      </p>
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
                          onClick={() => {
                            setIsModalOpen(false);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                      <LifeStoryPage lifeStory={currentNews || undefined} />
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
                      if (area === "" || date === "") {
                        alert("Por favor, complete todos los campos");
                        return;
                      }
                      if (!currentNews) {
                        alert("No se ha guardado la noticia");
                        return;
                      }
                      const dateParts = date.split("/");
                      const formattedDate = new Date(
                        +dateParts[2],
                        +dateParts[1] - 1,
                        +dateParts[0]
                      );
                      handlePublish(
                        currentNews.id,
                        formattedDate.toISOString(),
                        getAreaNameByValue(area)
                      );
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

export default AddLifeStories;