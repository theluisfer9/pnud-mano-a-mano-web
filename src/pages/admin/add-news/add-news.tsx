import "./add-news.css";
import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import LogoutIcon from "@/assets/add-news/box-arrow-left.svg";
import sampleNews from "../../../data/news";
import type { News } from "../../../data/news";
import NewsCard from "../../../components/News-Card/newscard";
import { useNavigate, useSearchParams } from "react-router-dom";
import SingleNews from "../../individual-news/news";
import { TagInput } from "@/components/TagInput/taginput";
import { ITag } from "@/hooks/useTagInput";
import LogoGobierno from "@/assets/navbar/logo_gob_add_new.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";
import SelectComponent from "@/components/Select/select";
import InfoIcon from "@/assets/information.svg";
import { addNews, getNews } from "@/db/queries";
import handleUploadFile from "@/services/uploadfile";
import { useQuery } from "@tanstack/react-query";
import getFile from "@/services/getfile";

type SetAdditionalSections = React.Dispatch<
  React.SetStateAction<{ image: string; body: string }[]>
>;

const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
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
      return "Pendiente";
  }
};

const initializeNewsData = async (
  news: News | null,
  {
    setNewsTitle,
    setNewsSubtitle,
    setMainBody,
    setAdditionalSections,
    setTags,
    setExternalLinks,
    setPreviewSrc,
    setArea,
    setDate,
  }: {
    setNewsTitle: (title: string) => void;
    setNewsSubtitle: (subtitle: string) => void;
    setMainBody: (body: string) => void;
    setAdditionalSections: SetAdditionalSections;
    setTags: (tags: ITag[]) => void;
    setExternalLinks: (links: string[]) => void;
    setPreviewSrc: (src: string) => void;
    setArea: (area: string) => void;
    setDate: (date: string) => void;
  }
) => {
  if (news) {
    setNewsTitle(news.title);
    setNewsSubtitle(news.subtitle);
    setMainBody(news.mainBody);
    setAdditionalSections(
      news.additionalSections.map((section) => ({
        ...section,
        image: section.image || "",
      }))
    );
    setTags(news.tags || []);
    setExternalLinks(news.externalLinks || []);
    const mainImage = await getFile(news.mainImage);
    setPreviewSrc(mainImage);
    news.additionalSections.forEach(async (section, index) => {
      if (section.image) {
        const image = await getFile(section.image);
        setAdditionalSections((prev: { image: string; body: string }[]) => {
          const newSections = [...prev];
          newSections[index].image = image;
          return newSections;
        });
      }
    });
    setArea(getAreaValueByLabel(news.area));
    setDate(news.date || "");
  }
};

const AddNews: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: newsData = [] } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
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
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const secondaryFileInputRefs: RefObject<HTMLInputElement>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  // Handle main image file change
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
        setAdditionalSections((prev) => {
          const newSections = [...prev];
          newSections[index].image = base64String;
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
    if (!date || !area) {
      alert("Por favor, complete todos los campos");
      return;
    }
    setIsLoading(true);

    try {
      // Convert base64 to File and upload main image
      const mainImageFile = base64ToFile(
        currentNews.mainImage,
        "main-image.jpg"
      );
      const mainImagePath = await handleUploadFile(mainImageFile, "news");

      // Convert and upload additional section images
      const updatedSections = await Promise.all(
        currentNews.additionalSections.map(async (section, index) => ({
          ...section,
          image: section.image
            ? await handleUploadFile(
                base64ToFile(section.image, `section-${index}.jpg`),
                "news"
              )
            : "",
        }))
      );

      const updatedNews: News = {
        ...currentNews,
        id: id,
        date: date,
        area: area,
        mainImage: mainImagePath,
        additionalSections: updatedSections,
      };

      await addNews(updatedNews);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error al subir las imágenes");
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (id) {
      const foundNews = newsData.find((n) => n.id === parseInt(id));
      if (foundNews) {
        initializeNewsData(foundNews, {
          setNewsTitle,
          setNewsSubtitle,
          setMainBody,
          setAdditionalSections,
          setTags,
          setExternalLinks,
          setPreviewSrc,
          setArea,
          setDate,
        });
      }
    }
  }, [id, newsData]);

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
                    value={newsTitle}
                    id="news-title-input"
                    type="text"
                    placeholder="Editar titulo de noticia *"
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
                        Fotografía de encabezado *
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
                    placeholder="Editar subtítulo de noticia *"
                    onChange={(e) => setNewsSubtitle(e.target.value)}
                  />
                  <textarea
                    id="news-body-input"
                    ref={textareaRef}
                    placeholder="Editar cuerpo de texto (máximo 1800 caracteres) *"
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
                  <div className="tags">
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
                  <div className="external-links">
                    <label>Añadir enlaces externos:</label>
                    <input
                      value={externalLinks.join(" ")}
                      type="text"
                      placeholder="Para ingresar más de un enlace, separalos por comas"
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
                    onClick={() => navigate("/dashboard")}
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="publish"
                    onClick={(e) => {
                      e.preventDefault();
                      // Check that at least title, subtitle, mainbody, main image are not empty
                      if (
                        newsTitle === "" ||
                        newsSubtitle === "" ||
                        mainBody === "" ||
                        previewSrc === ""
                      ) {
                        alert("Los campos con * son obligatorios");
                        return;
                      }
                      setCurrentStep(1);
                      const newsToSave: News = {
                        title: newsTitle,
                        subtitle: newsSubtitle,
                        mainBody: mainBody,
                        mainImage: previewSrc,
                        additionalSections: additionalSections,
                        tags: tags,
                        externalLinks: externalLinks,
                        area: area,
                        date: date,
                        id: sampleNews.length + 1,
                        state: "draft",
                      };
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
                <div className="flex flex-row justify-center items-center gap-6 w-full">
                  <div className="w-[40%]">
                    <NewsCard
                      area={getAreaNameByValue(area) || "Not found"}
                      imageUrl={currentNews?.mainImage || ""}
                      title={currentNews?.title || ""}
                      key={currentNews?.id}
                      onClick={() => {
                        setIsModalOpen(true);
                        // update the date and area to the currentNews
                        const dateParts = date.split("/");
                        const formattedDate = new Date(
                          +dateParts[2],
                          +dateParts[1] - 1,
                          +dateParts[0]
                        );
                        if (currentNews) {
                          currentNews.area = getAreaNameByValue(area);
                          currentNews.date = formattedDate.toISOString();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-[24px] justify-center items-center w-[60%]">
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
                        placeholder="Ministerio"
                        width="full"
                        value={area}
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
                          value={new Date(date).toLocaleDateString("es-GT")}
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

export default AddNews;
