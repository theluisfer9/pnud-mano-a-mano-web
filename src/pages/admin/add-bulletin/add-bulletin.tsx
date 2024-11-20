import "./add-bulletin.css";
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
import InfoIcon from "@/assets/information.svg";
import { addBulletins } from "@/db/queries";
import { Bulletin } from "@/data/bulletins";
import BulletinPage from "@/pages/individual-bulletin/individual-bulletin";
import { TagInput } from "@/components/TagInput/taginput";
import { ITag } from "@/hooks/useTagInput";
import handleUploadFile from "@/services/uploadfile";

const AddBulletin: React.FC = () => {
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
  const [mainBody, setMainBody] = useState("");
  const [secondaryBody1, setSecondaryBody1] = useState("");
  const [secondaryBody2, setSecondaryBody2] = useState("");
  const [secondaryBody3, setSecondaryBody3] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [value, setValue] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);

  const [date, setDate] = useState("");
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const secondaryFileInputRefs: RefObject<HTMLInputElement>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [currentBulletin, setCurrentBulletin] = useState<Bulletin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };
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
  const handleSecondaryImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSecondaryImages((prev) => {
          const newSections = [...prev];
          newSections[index] = base64String;
          return newSections;
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const base64ToFile = (base64: string, filename: string) => {
    const base64String = base64.split(";base64,").pop() || "";
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: "image/jpeg" });
  };
  const handlePublish = async (id: number, date: string, topics: string[]) => {
    if (!currentBulletin) {
      alert("No se ha guardado el boletín");
      return;
    }
    setIsLoading(true); // Start loading
    // if mainSecondaryImage is not empty, upload it
    let mainSecondaryImageUrl = "";
    if (currentBulletin.mainSecondaryImage) {
      mainSecondaryImageUrl = await handleUploadFile(
        base64ToFile(currentBulletin.mainSecondaryImage, "image"),
        "bulletins"
      );
    }
    // if additionalImages is not empty, upload them
    let additionalImagesUrls: string[] = [];
    if (
      currentBulletin.additionalImages &&
      currentBulletin.additionalImages.length > 0
    ) {
      additionalImagesUrls = await Promise.all(
        currentBulletin.additionalImages.map((image) =>
          handleUploadFile(base64ToFile(image, "image"), "bulletins")
        )
      );
    }
    const updatedBulletin: Bulletin = {
      ...currentBulletin,
      id: id,
      date: date,
      topics: topics,
      mainSecondaryImage: mainSecondaryImageUrl,
      additionalImages: additionalImagesUrls,
    };
    await addBulletins(updatedBulletin);
    setIsLoading(false); // End loading
    navigate("/dashboard");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [mainBody]);

  const handleMainBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 1800);
    setMainBody(text);
  };
  const handleSecondaryBody1Change = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 600);
    setSecondaryBody1(text);
  };
  const handleSecondaryBody2Change = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 600);
    setSecondaryBody2(text);
  };
  const handleSecondaryBody3Change = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 600);
    setSecondaryBody3(text);
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
                <span className="stepper-text">Nuevo Boletin</span>
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
                    placeholder="Editar titulo del boletin *"
                    onChange={(e) => setNewsTitle(e.target.value)}
                  />
                </div>
                <div className="mb-[24px]">
                  <textarea
                    id="news-body-input"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 1800 caracteres) *"
                    onChange={(e) => {
                      handleMainBodyChange(e);
                      adjustTextareaHeight(e.target);
                    }}
                    value={mainBody}
                    maxLength={1800}
                    className="w-full min-h-[64px] p-4 border border-[#aeb4c1] rounded-lg resize-none overflow-hidden"
                    onInput={(e) =>
                      adjustTextareaHeight(e.target as HTMLTextAreaElement)
                    }
                  />
                </div>
                <div className="w-full mb-4">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                    onChange={(e) => handleSecondaryFileChange(e, 0)}
                    style={{ display: "none" }}
                  />
                  <div
                    className={`secondary-image-upload secondary-image-upload-0 w-full my-[32px] h-[128px]`}
                    onClick={() => handleDivClick()}
                  >
                    {additionalImages[0] ? (
                      <img
                        src={additionalImages[0]}
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
                <div className="flex gap-[24px] mt-[32px]">
                  <textarea
                    id="news-secondary-body-input-1"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 600 caracteres)"
                    onChange={(e) => {
                      handleSecondaryBody1Change(e);
                      adjustTextareaHeight(e.target);
                    }}
                    value={secondaryBody1}
                    maxLength={600}
                    className="w-full min-h-[64px] p-4 border border-[#aeb4c1] rounded-lg resize-none overflow-hidden"
                    onInput={(e) =>
                      adjustTextareaHeight(e.target as HTMLTextAreaElement)
                    }
                  />
                  <textarea
                    id="news-secondary-body-input-2"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 600 caracteres)"
                    onChange={(e) => {
                      handleSecondaryBody2Change(e);
                      adjustTextareaHeight(e.target);
                    }}
                    value={secondaryBody2}
                    maxLength={600}
                    className="w-full min-h-[64px] p-4 border border-[#aeb4c1] rounded-lg resize-none overflow-hidden"
                    onInput={(e) =>
                      adjustTextareaHeight(e.target as HTMLTextAreaElement)
                    }
                  />
                </div>
                <div className="flex gap-[24px]">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="w-full mb-4">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={secondaryFileInputRefs[index]}
                        onChange={(e) => handleSecondaryImageChange(e, index)}
                        style={{ display: "none" }}
                      />
                      <div
                        className={`secondary-image-upload secondary-image-upload-${index} w-full my-[32px] h-[128px]`}
                        onClick={() => handleSecondaryDivClick(index)}
                      >
                        {secondaryImages[index] ? (
                          <img
                            src={secondaryImages[index]}
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
                </div>
                <div className="flex mb-8">
                  <textarea
                    id="news-secondary-body-input-1"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 600 caracteres)"
                    onChange={(e) => {
                      handleSecondaryBody3Change(e);
                      adjustTextareaHeight(e.target);
                    }}
                    value={secondaryBody3}
                    maxLength={600}
                    className="w-full min-h-[64px] p-4 border border-[#aeb4c1] rounded-lg resize-none overflow-hidden"
                    onInput={(e) =>
                      adjustTextareaHeight(e.target as HTMLTextAreaElement)
                    }
                  />
                </div>
                <hr className="my-6" />
                <span className="text-[#474e5c] text-[24px]">
                  Información Adicional
                </span>
                <div className="tags mt-[16px] mb-[24px]">
                  <label>Añadir etiquetas:</label>
                  <TagInput
                    value={value}
                    onChangeValue={setValue}
                    tags={tags}
                    onChangeTags={setTags}
                    showEdit
                    placeholder="Para ingresar más de una etiqueta, separalas por comas"
                  />
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
                      // Check that at least title, main body are not empty
                      if (newsTitle === "" || mainBody === "") {
                        alert("Los campos con * son obligatorios");
                        return;
                      }
                      setCurrentStep(1);
                      const bulletinToSave: Bulletin = {
                        additionalImages: secondaryImages,
                        firstAdditionalBody: secondaryBody1,
                        secondAdditionalBody: secondaryBody2,
                        mainSecondaryImage: additionalImages[0],
                        thirdAdditionalBody: secondaryBody3,
                        body: mainBody,
                        date: date,
                        id: 1,
                        title: newsTitle,
                        tags: tags.map((tag) => tag.tagName),
                        topics: [],
                      };
                      setCurrentBulletin(bulletinToSave);
                    }}
                  >
                    Continuar con el boletín
                  </button>
                </div>
              </form>
            ) : (
              <div className="review-news-container p-[32px]">
                <h3 className="mb-[32px]">
                  Visualización y configuración del panel de boletín
                </h3>
                <div className="flex flex-row justify-center items-start w-full h-full gap-10">
                  <div className="flex flex-col p-6 justify-between w-[40%] h-[140px] bg-[#F3F4F6] rounded-lg">
                    <span className="text-[14px] text-[#667085]">{date}</span>
                    <span className="text-[20px] font-bold text-[#667085] leading-[200%]">
                      {currentBulletin?.title}
                    </span>
                    <span
                      className="w-fit text-[14px] text-[#667085] leading-6 underline cursor-pointer"
                      onClick={() => {
                        // update the current bulletin
                        setCurrentBulletin({
                          ...(currentBulletin as Bulletin),
                          date: date,
                          topics: topics,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Ver más
                    </span>
                  </div>
                  <div className="flex flex-col gap-[16px] justify-start items-center w-[60%] h-full">
                    <div
                      id="topics-container-1"
                      className="flex w-full justify-center items-center gap-[24px] text-[#667085]"
                    >
                      <div
                        id="topic-container-1"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Tema 01 del boletín</p>
                        <input
                          type="text"
                          placeholder="Ingresar tema"
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          value={topics[0] || ""}
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[0] = e.target.value;
                            setTopics(newTopics);
                          }}
                        />
                      </div>
                      <div
                        id="topic-container-2"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Tema 02 del boletín</p>
                        <input
                          type="text"
                          value={topics[1] || ""}
                          placeholder="Ingresar tema"
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[1] = e.target.value;
                            setTopics(newTopics);
                          }}
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                        />
                      </div>
                    </div>
                    <div
                      id="topics-container-2"
                      className="flex w-full justify-center items-center gap-[24px] text-[#667085]"
                    >
                      <div
                        id="topic-container-3"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Tema 03 del boletín</p>
                        <input
                          type="text"
                          placeholder="Ingresar tema"
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          value={topics[2] || ""}
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[2] = e.target.value;
                            setTopics(newTopics);
                          }}
                        />
                      </div>
                      <div
                        id="topic-container-4"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Tema 04 del boletín</p>
                        <input
                          type="text"
                          placeholder="Ingresar tema"
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          value={topics[3] || ""}
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[3] = e.target.value;
                            setTopics(newTopics);
                          }}
                        />
                      </div>
                    </div>
                    <div
                      id="topics-container-3"
                      className="flex w-full justify-center items-center gap-[24px] text-[#667085]"
                    >
                      <div
                        id="topic-container-5"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Tema 05 del boletín</p>
                        <input
                          type="text"
                          placeholder="Ingresar tema"
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          value={topics[4] || ""}
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[4] = e.target.value;
                            setTopics(newTopics);
                          }}
                        />
                      </div>
                      <div
                        id="topic-container-6"
                        className="flex flex-col w-[50%]"
                      >
                        <p>Tema 06 del boletín</p>
                        <input
                          type="text"
                          placeholder="Ingresar tema"
                          className="border-[1px] border-[#aeb4c1] rounded-sm p-2"
                          value={topics[5] || ""}
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[5] = e.target.value;
                            setTopics(newTopics);
                          }}
                        />
                      </div>
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
                      <BulletinPage bulletin={currentBulletin || undefined} />
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
                      if (date === "") {
                        alert("Por favor, complete todos los campos");
                        return;
                      }
                      // At least one topic is required
                      if (topics.length === 0) {
                        alert("Por favor, ingrese al menos un tema");
                        return;
                      }
                      if (!currentBulletin) {
                        alert("No se ha guardado el boletín");
                        return;
                      }
                      const dateParts = date.split("/");
                      const formattedDate = new Date(
                        +dateParts[2],
                        +dateParts[1] - 1,
                        +dateParts[0]
                      );
                      handlePublish(
                        currentBulletin.id,
                        formattedDate.toISOString(),
                        topics
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

export default AddBulletin;
