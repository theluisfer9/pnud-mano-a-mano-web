import "./add-press-release.css";
import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import LogoutIcon from "@/assets/add-news/box-arrow-left.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import LogoGobierno from "@/assets/navbar/logo_gob_add_new.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";
import SelectComponent from "@/components/Select/select";
import InfoIcon from "@/assets/information.svg";
import { addPressReleases, updatePressReleases } from "@/db/queries";
import { PressRelease } from "@/data/pressrelease";
import PressReleasePage from "@/pages/invividual-press-release/pressrelease";
import PressReleaseCard from "@/components/PressRelease-Card/card";
import handleUploadFile from "@/services/uploadfile";
import { useQuery } from "@tanstack/react-query";
import { getPressReleases } from "@/db/queries";
import getFile from "@/services/getfile";

const AddPressRelease: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: pressReleasesData = [] } = useQuery({
    queryKey: ["pressreleases"],
    queryFn: getPressReleases,
    staleTime: 3 * 60 * 1000,
  });
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
  const [previewSrc, setPreviewSrc] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const previewSrcRef = useRef<HTMLInputElement>(null);
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [currentPressRelease, setCurrentPressRelease] =
    useState<PressRelease | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [originalPressRelease, setOriginalPressRelease] =
    useState<PressRelease | null>(null);

  const handleMainDivClick = () => {
    previewSrcRef.current?.click();
  };
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  // Handle main image file change
  const handleMainFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
  const base64ToFile = (base64: string, filename: string) => {
    const base64String = base64.split(";base64,").pop() || "";

    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: "application/pdf" });
  };
  const base64ToImage = (base64: string, filename: string) => {
    const base64String = base64.split(";base64,").pop() || "";
    const byteCharacters = atob(base64String);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new File([byteArray], filename, { type: "image/jpeg" });
  };

  const handlePublish = async (id: number, date: string, category: string) => {
    if (!currentPressRelease) {
      alert("No se ha guardado el comunicado de prensa");
      return;
    }
    if (!date || !category) {
      alert("Por favor, complete todos los campos");
      return;
    }
    setIsLoading(true); // Start loading
    const pdfUrl = await handleUploadFile(
      base64ToFile(currentPressRelease.pdfSource, "pdf"),
      "press-releases"
    );
    if (!currentPressRelease.mainImage) {
      alert("No se ha guardado la imagen de portada");
      return;
    }
    const mainImageUrl = await handleUploadFile(
      base64ToImage(currentPressRelease.mainImage, "jpg"),
      "press-releases"
    );
    const updatedPressRelease: PressRelease = {
      ...currentPressRelease,
      id: id,
      date: date,
      category: category,
      pdfSource: pdfUrl,
      mainImage: mainImageUrl,
      state: "PUBLISHED",
      publisherid: parsedUser.id,
      timesedited: 0,
    };
    await addPressReleases(updatedPressRelease);
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
    const text = e.target.value.slice(0, 1200);
    setMainBody(text);
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

  const getAreaValueByLabel = (label: string) => {
    switch (label) {
      case "MICIVI":
        return "comunicaciones";
      case "MCD":
        return "cultura_y_deportes";
      case "MIDES":
        return "desarrollo_social";
      case "MIDECO":
        return "economia";
      case "MINTRAB":
        return "trabajo";
      case "MAGA":
        return "agricultura";
      case "MINEDUC":
        return "educacion";
      case "MSPAS":
        return "salud";
      case "MINDEF":
        return "defensa";
      case "MEM":
        return "energia";
      case "SESAN":
        return "sesan";
      default:
        return "";
    }
  };

  const initializePressReleaseData = async (
    pressRelease: PressRelease | null,
    {
      setNewsTitle,
      setMainBody,
      setPreviewSrc,
      setAdditionalImages,
      setArea,
      setDate,
      setOriginalPressRelease,
    }: {
      setNewsTitle: (title: string) => void;
      setMainBody: (body: string) => void;
      setPreviewSrc: (src: string) => void;
      setAdditionalImages: (images: string[]) => void;
      setArea: (area: string) => void;
      setDate: (date: string) => void;
      setOriginalPressRelease: (pressRelease: PressRelease) => void;
    }
  ) => {
    if (pressRelease) {
      if (!pressRelease.mainImage) {
        return;
      }
      setOriginalPressRelease(pressRelease);
      setNewsTitle(pressRelease.title);
      setMainBody(pressRelease.body);

      const mainImage = await getFile(pressRelease.mainImage);
      setPreviewSrc(mainImage);

      const pdfFile = await getFile(pressRelease.pdfSource);
      setAdditionalImages([pdfFile]);

      setArea(getAreaValueByLabel(pressRelease.category));
      setDate(new Date(pressRelease.date).toLocaleDateString("es-GT"));
    }
  };

  useEffect(() => {
    if (id) {
      const foundPressRelease = pressReleasesData.find(
        (p) => p.id === parseInt(id)
      );
      if (foundPressRelease) {
        setIsBeingEdited(true);
        initializePressReleaseData(foundPressRelease, {
          setNewsTitle,
          setMainBody,
          setPreviewSrc,
          setAdditionalImages,
          setArea,
          setDate,
          setOriginalPressRelease,
        });
      }
    }
  }, [id, pressReleasesData]);

  const handleUpdate = async (date: string, category: string) => {
    if (!currentPressRelease || !originalPressRelease) {
      alert("No se ha guardado el comunicado de prensa");
      return;
    }
    if (!date || !category) {
      alert("Por favor, complete todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      let pdfUrl = currentPressRelease.pdfSource;
      let mainImageUrl = currentPressRelease.mainImage;

      // Only upload new files if they've changed (are base64)
      if (currentPressRelease.pdfSource.startsWith("data:")) {
        pdfUrl = await handleUploadFile(
          base64ToFile(currentPressRelease.pdfSource, "pdf"),
          "press-releases"
        );
      }
      if (currentPressRelease.pdfSource.includes("blob")) {
        pdfUrl = originalPressRelease.pdfSource;
      }
      if (!currentPressRelease.mainImage) {
        alert("No se ha guardado la imagen de portada");
        return;
      }

      if (currentPressRelease.mainImage.startsWith("data:")) {
        mainImageUrl = await handleUploadFile(
          base64ToImage(currentPressRelease.mainImage, "jpg"),
          "press-releases"
        );
      }
      if (currentPressRelease.mainImage.includes("blob")) {
        mainImageUrl = originalPressRelease.mainImage;
      }

      const updatedPressRelease: PressRelease = {
        ...currentPressRelease,
        date: date,
        category: category,
        pdfSource: pdfUrl,
        mainImage: mainImageUrl,
        timesedited: originalPressRelease.timesedited
          ? originalPressRelease.timesedited + 1
          : 1,
        publisherid: parsedUser.id,
        state: "PUBLISHED",
      };

      await updatePressReleases(updatedPressRelease);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating press release:", error);
      alert("Error al actualizar el comunicado de prensa");
    } finally {
      setIsLoading(false);
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
                <span className="stepper-text">Nuevo comunicado de prensa</span>
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
                    placeholder="Editar titulo del comunicado de prensa *"
                    onChange={(e) => setNewsTitle(e.target.value)}
                    defaultValue={newsTitle}
                  />
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={previewSrcRef}
                    onChange={handleMainFileChange}
                    className="hidden"
                  />
                  <div
                    className={`w-full border-2 border-dashed border-[#aeb4c1] rounded-lg cursor-pointer flex flex-col items-center justify-center bg-transparent hover:bg-gray-100 transition-colors ${
                      previewSrc ? "h-auto max-h-[400px]" : "h-[200px]"
                    }`}
                    onClick={handleMainDivClick}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-[#505050]">
                        <span className="text-3xl block mb-2">+</span>
                        <span className="text-sm">
                          Fotografía para portada *
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-[24px] my-4">
                  <textarea
                    id="news-body-input"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 1200 caracteres) *"
                    onChange={(e) => {
                      handleMainBodyChange(e);
                      adjustTextareaHeight(e.target);
                    }}
                    value={mainBody}
                    maxLength={1200}
                    className="w-full min-h-[64px] p-4 border border-[#aeb4c1] rounded-lg resize-none overflow-hidden"
                    onInput={(e) =>
                      adjustTextareaHeight(e.target as HTMLTextAreaElement)
                    }
                  />
                </div>
                <div className="w-full my-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={(e) => handleSecondaryFileChange(e, 0)}
                    className="hidden"
                  />
                  <div
                    className={`w-full border-2 border-dashed border-[#aeb4c1] rounded-lg cursor-pointer flex flex-col items-center justify-center bg-transparent hover:bg-gray-100 transition-colors ${
                      additionalImages[0] ? "h-auto" : "h-[200px]"
                    }`}
                    onClick={handleDivClick}
                  >
                    {additionalImages[0] ? (
                      <div className="relative w-full">
                        <iframe
                          src={additionalImages[0]}
                          className="w-full h-screen rounded-lg"
                          key={additionalImages[0]}
                        ></iframe>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (fileInputRef.current) {
                              fileInputRef.current.click();
                            }
                          }}
                          className="absolute top-4 right-4 bg-white text-[#1C2851] px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                        >
                          Cambiar PDF
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-[#505050]">
                        <span className="text-3xl block mb-2">+</span>
                        <span className="text-sm">Documento PDF *</span>
                      </div>
                    )}
                  </div>
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
                      // Check that at least title, main body and pdf are not empty
                      if (
                        newsTitle === "" ||
                        mainBody === "" ||
                        additionalImages[0] === "" ||
                        previewSrc === ""
                      ) {
                        alert("Los campos con * son obligatorios");
                        return;
                      }
                      setCurrentStep(1);
                      const pressReleaseToSave: PressRelease = {
                        body: mainBody,
                        category: "",
                        date: date,
                        id: id ? parseInt(id) : -1,
                        pdfSource: additionalImages[0],
                        title: newsTitle,
                        mainImage: previewSrc,
                      };
                      setCurrentPressRelease(pressReleaseToSave);
                    }}
                  >
                    Continuar con el comunicado de prensa
                  </button>
                </div>
              </form>
            ) : (
              <div className="review-news-container p-[32px]">
                <h3 className="mb-[32px]">
                  Visualización del comunicado de prensa
                </h3>
                <div className="flex flex-row justify-center items-center w-full gap-10">
                  <div className="w-[40%] h-full">
                    <PressReleaseCard
                      height="100%"
                      onClick={() => {
                        // update currentPressRelease with the new date and category
                        const dateParts = date.split("/");
                        const formattedDate = new Date(
                          +dateParts[2],
                          +dateParts[1] - 1,
                          +dateParts[0]
                        );
                        setCurrentPressRelease({
                          ...(currentPressRelease as PressRelease),
                          date: formattedDate.toISOString(),
                          category: getAreaNameByValue(area),
                        });
                        setIsModalOpen(true);
                      }}
                      category={getAreaNameByValue(area)}
                      date={date}
                      title={currentPressRelease?.title || ""}
                      mainImage={currentPressRelease?.mainImage || ""}
                    />
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
                      <PressReleasePage
                        pressRelease={currentPressRelease || undefined}
                      />
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
                      if (!currentPressRelease) {
                        alert("No se ha guardado el comunicado de prensa");
                        return;
                      }
                      const dateParts = date.split("/");
                      const formattedDate = new Date(
                        +dateParts[2],
                        +dateParts[1] - 1,
                        +dateParts[0]
                      );
                      if (isBeingEdited) {
                        handleUpdate(
                          formattedDate.toISOString(),
                          getAreaNameByValue(area)
                        );
                      } else {
                        handlePublish(
                          currentPressRelease.id,
                          formattedDate.toISOString(),
                          getAreaNameByValue(area)
                        );
                      }
                    }}
                  >
                    {isBeingEdited
                      ? "Actualizar comunicado de prensa"
                      : "Publicar comunicado de prensa"}
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

export default AddPressRelease;
