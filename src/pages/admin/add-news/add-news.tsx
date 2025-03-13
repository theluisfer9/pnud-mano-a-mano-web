import "./add-news.css";
import React, {
  ChangeEvent,
  RefObject,
  useCallback,
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
import { addNews, getNews, updateNews } from "@/db/queries";
import handleUploadFile from "@/services/uploadfile";
import { useQuery } from "@tanstack/react-query";
import getFile from "@/services/getfile";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";

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
    setOriginalNews,
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
    setOriginalNews: (news: News) => void;
  }
) => {
  if (news) {
    setOriginalNews(news);
    setNewsTitle(news.title);
    setNewsSubtitle(news.subtitle);
    setMainBody(news.mainBody);
    setAdditionalSections(
      news.additionalSections.length > 0
        ? news.additionalSections.map((section) => ({
            ...section,
            image: section.image || "",
          }))
        : [
            { image: "", body: "" },
            { image: "", body: "" },
            { image: "", body: "" },
          ]
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
  const [mainImageCrop, setMainImageCrop] = useState({ x: 0, y: 0 });
  const [mainImageZoom, setMainImageZoom] = useState(1);
  const [mainImageCroppedAreaPixels, setMainImageCroppedAreaPixels] =
    useState(null);
  const [isMainImageCropped, setIsMainImageCropped] = useState(false);
  const [mainImageCropped, setMainImageCropped] = useState("");
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [secondaryImageCrops, setSecondaryImageCrops] = useState<
    {
      crop: { x: number; y: number };
      zoom: number;
      croppedAreaPixels: any;
    }[]
  >([
    { crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null },
    { crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null },
    { crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null },
  ]);
  const [isSecondaryImageCropped, setIsSecondaryImageCropped] = useState<
    boolean[]
  >([false, false, false]);
  const [secondaryImageCropped, setSecondaryImageCropped] = useState<string[]>([
    "",
    "",
    "",
  ]);

  const secondaryFileInputRefs: RefObject<HTMLInputElement>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [mediaDisplay, setMediaDisplay] = useState<
    {
      image: string;
      video: string;
    }[]
  >([
    { image: "", video: "" },
    { image: "", video: "" },
    { image: "", video: "" },
  ]);
  const mediaFileInputRefs: RefObject<HTMLInputElement>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [originalNews, setOriginalNews] = useState<News | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(
    null
  );
  const [youtubeUrl, setYoutubeUrl] = useState("");

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
  const handleMainImageCropComplete = useCallback(
    (_croppedArea: any, _croppedAreaPixels: any) => {
      setMainImageCroppedAreaPixels(_croppedAreaPixels);
    },
    []
  );

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
  const handleMediaDivClick = (index: number) => {
    mediaFileInputRefs[index].current?.click();
  };
  const handleMediaFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setMediaDisplay((prev) => {
          const newMedia = [...prev];
          newMedia[index].image = base64String;
          return newMedia;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoDivClick = (index: number) => {
    setCurrentVideoIndex(index);
    setIsVideoModalOpen(true);
  };

  const handleVideoUrlSubmit = () => {
    if (currentVideoIndex !== null) {
      setMediaDisplay((prev) => {
        const newMedia = [...prev];
        newMedia[currentVideoIndex].video = youtubeUrl;
        return newMedia;
      });
      setIsVideoModalOpen(false);
      setYoutubeUrl("");
    }
  };

  const extractVideoId = (url: string) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
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
        currentNews.additionalSections.map(async (section, index) => {
          if (!section.image) {
            return { ...section, image: "" };
          }

          // Check if the image is a base64 string
          if (section.image.startsWith("data:image")) {
            const uploadedPath = await handleUploadFile(
              base64ToFile(section.image, `section-${index}.jpg`),
              "news"
            );
            return { ...section, image: uploadedPath };
          }

          // If not base64, keep the existing image path
          return section;
        })
      );
      const updatedMediaDisplay = await Promise.all(
        currentNews.mediaDisplay.map(async (media, index) => {
          if (media.image) {
            const uploadedPath = await handleUploadFile(
              base64ToFile(media.image, `media-${index}.jpg`),
              "news"
            );
            return { ...media, image: uploadedPath };
          }
          return media;
        })
      );

      const updatedNews: News = {
        ...currentNews,
        id: id,
        date: date,
        area: area,
        mainImage: mainImagePath,
        additionalSections: updatedSections,
        mediaDisplay: updatedMediaDisplay,
        timesedited: 0,
        publisherid: parsedUser.id,
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
  const handleUpdate = async (date: string, area: string) => {
    if (!currentNews || !originalNews) {
      alert("No se ha guardado la noticia");
      return;
    }
    if (!date || !area) {
      alert("Por favor, complete todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      // Check if the images have changed
      let mainImagePath = currentNews.mainImage;
      // if the previewSrc is a blob, keep the original image
      if (previewSrc.startsWith("blob:")) {
        mainImagePath = originalNews.mainImage;
      } else {
        const mainImageFile = base64ToFile(previewSrc, "main-image.jpg");
        mainImagePath = await handleUploadFile(mainImageFile, "news");
      }
      // Check if the additional sections have changed
      const updatedSections = await Promise.all(
        currentNews.additionalSections.map(async (section, index) => {
          if (!section.image) {
            return { ...section, image: "" };
          }

          // If the image is a base64 string, upload it
          if (section.image.startsWith("data:image")) {
            const uploadedPath = await handleUploadFile(
              base64ToFile(section.image, `section-${index}.jpg`),
              "news"
            );
            return { ...section, image: uploadedPath };
          } else {
            // use the original image
            return {
              ...section,
              image: originalNews.additionalSections[index].image,
            };
          }
        })
      );
      const updatedNews: News = {
        ...currentNews,
        date: date,
        area: area,
        mainImage: mainImagePath,
        additionalSections: updatedSections,
        timesedited: originalNews.timesedited
          ? originalNews.timesedited + 1
          : 1,
      };
      await updateNews(updatedNews);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Error al actualizar la noticia");
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
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  useEffect(() => {
    if (id) {
      const foundNews = newsData.find((n) => n.id === parseInt(id));
      if (foundNews) {
        setIsBeingEdited(true);
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
          setOriginalNews,
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
      {isVideoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-2xl font-bold mb-3">Ingresar URL de YouTube</h2>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border p-2 w-full mb-3"
            />
            <button
              onClick={handleVideoUrlSubmit}
              className="mt-2 mr-2 bg-[#2f4489] text-white hover:bg-[#2f4489]/80 px-4 py-2 rounded"
            >
              Añadir video
            </button>
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="mt-2 bg-transparent border border-[#2f4489] text-[#2f4489] hover:bg-[#2f4489]/10 px-4 py-2 rounded"
            >
              Cancelar
            </button>
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
                <div className="w-full flex flex-row justify-center items-center mb-6">
                  {previewSrc && !isMainImageCropped ? (
                    <ImageCropper
                      image={previewSrc}
                      crop={mainImageCrop}
                      zoom={mainImageZoom}
                      croppedAreaPixels={mainImageCroppedAreaPixels}
                      onCropChange={setMainImageCrop}
                      onZoomChange={setMainImageZoom}
                      onCropComplete={handleMainImageCropComplete}
                      setIsCropped={setIsMainImageCropped}
                      setCroppedImage={setMainImageCropped}
                    />
                  ) : isMainImageCropped ? (
                    <div className="flex-col aspect-video">
                      <img
                        src={mainImageCropped}
                        alt="Main image"
                        className="w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="main-image-upload flex-col w-full"
                      onClick={handleDivClick}
                    >
                      <span>
                        +<br />
                        Fotografía de encabezado *
                      </span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </div>
                <div className="subtitle mb-[32px]">
                  <input
                    id="news-subtitle-input"
                    type="text"
                    placeholder="Editar subtítulo de noticia *"
                    onChange={(e) => setNewsSubtitle(e.target.value)}
                    value={newsSubtitle}
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
                      placeholder="Ingresar cuerpo de texto adicional aquí (máximo 1600 caracteres)"
                      maxLength={1600}
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
                            1600
                          );
                          return newSections;
                        });
                      }}
                      value={additionalSections[index].body}
                    ></textarea>
                    {additionalSections[index].image ? (
                      <>
                        {isSecondaryImageCropped[index] ? (
                          <img
                            src={secondaryImageCropped[index]}
                            alt="Cropped Preview"
                            className="image-preview mb-6"
                          />
                        ) : (
                          <>
                            <ImageCropper
                              image={additionalSections[index].image}
                              crop={secondaryImageCrops[index].crop}
                              zoom={secondaryImageCrops[index].zoom}
                              croppedAreaPixels={
                                secondaryImageCrops[index].croppedAreaPixels
                              }
                              onCropChange={(crop) => {
                                setSecondaryImageCrops((prev) => {
                                  const newCrops = [...prev];
                                  newCrops[index] = {
                                    ...newCrops[index],
                                    crop: crop,
                                  };
                                  return newCrops;
                                });
                              }}
                              onZoomChange={(zoom) => {
                                setSecondaryImageCrops((prev) => {
                                  const newZooms = [...prev];
                                  newZooms[index] = {
                                    ...newZooms[index],
                                    zoom: zoom,
                                  };
                                  return newZooms;
                                });
                              }}
                              onCropComplete={(
                                _croppedArea: any,
                                _croppedAreaPixels: any
                              ) => {
                                setSecondaryImageCrops((prev) => {
                                  const newCroppedAreaPixels = [...prev];
                                  newCroppedAreaPixels[index] = {
                                    ...newCroppedAreaPixels[index],
                                    croppedAreaPixels: _croppedAreaPixels,
                                  };
                                  console.log(
                                    "The new cropped area pixels are:",
                                    newCroppedAreaPixels[index]
                                  );
                                  return newCroppedAreaPixels;
                                });
                              }}
                              setIsCropped={(cropped: boolean) => {
                                setIsSecondaryImageCropped((prev) => {
                                  const newIsCropped = [...prev];
                                  newIsCropped[index] = cropped;
                                  return newIsCropped;
                                });
                              }}
                              setCroppedImage={(croppedImage: string) => {
                                setSecondaryImageCropped((prev) => {
                                  const newCroppedImages = [...prev];
                                  newCroppedImages[index] = croppedImage;
                                  return newCroppedImages;
                                });
                              }}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
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
                          <span className="image-placeholder">
                            +<br />
                            Fotografía secundaria
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-4 w-full mb-6">
                  <h2 className="text-xl">Display Multimedia</h2>
                  <div className="flex gap-4 w-full">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-center items-center gap-4 w-full border-2 border-dashed border-[#aeb4c1] rounded-lg h-[300px] cursor-pointer"
                      >
                        {mediaDisplay[index].image ? (
                          <img
                            src={mediaDisplay[index].image}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg"
                            onClick={() => handleMediaDivClick(index)}
                          />
                        ) : mediaDisplay[index].video ? (
                          <img
                            src={`https://img.youtube.com/vi/${extractVideoId(
                              mediaDisplay[index].video
                            )}/0.jpg`}
                            alt={`Video Thumbnail ${index}`}
                            className="w-full h-full object-cover rounded-lg"
                            onClick={() => handleVideoDivClick(index)}
                          />
                        ) : (
                          <>
                            <div className="flex h-full">
                              <div className="flex justify-center items-center">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  ref={mediaFileInputRefs[index]}
                                  onChange={(e) =>
                                    handleMediaFileChange(e, index)
                                  }
                                  style={{ display: "none" }}
                                />
                                <span
                                  className="image-placeholder flex-1 text-center py-4 px-6 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleMediaDivClick(index)}
                                >
                                  Fotografía secundaria
                                </span>
                              </div>

                              <div className="border-r-2 border-dashed border-[#aeb4c1]"></div>
                              <div className="flex justify-center items-center">
                                <span
                                  className="image-placeholder flex-1 text-center py-4 px-6 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleVideoDivClick(index)}
                                >
                                  Video adicional
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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
                      let idToSave = sampleNews.length + 1;
                      if (isBeingEdited) {
                        idToSave = originalNews?.id || 0;
                      }
                      const additionalSectionsToSave = additionalSections.map(
                        (section, index) => ({
                          ...section,
                          image: secondaryImageCropped[index]
                            ? secondaryImageCropped[index]
                            : null,
                        })
                      );
                      const newsToSave: News = {
                        title: newsTitle,
                        subtitle: newsSubtitle,
                        mainBody: mainBody,
                        mainImage: mainImageCropped,
                        additionalSections: additionalSectionsToSave,
                        tags: tags,
                        externalLinks: externalLinks,
                        area: area,
                        date: date,
                        mediaDisplay: mediaDisplay,
                        id: idToSave,
                        state: "PUBLISHED",
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
                      if (isBeingEdited) {
                        handleUpdate(date, getAreaNameByValue(area));
                      } else {
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
                      }
                    }}
                  >
                    {isBeingEdited ? "Actualizar noticia" : "Publicar noticia"}
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

interface ImageCropperProps {
  image: string;
  crop: any;
  zoom: number;
  croppedAreaPixels: any;
  onCropChange: (crop: any) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  setIsCropped: (isCropped: boolean) => void;
  setCroppedImage: (croppedImage: string) => void;
}
const ImageCropper = ({
  image,
  crop,
  zoom,
  croppedAreaPixels,
  onCropChange,
  onZoomChange,
  onCropComplete,
  setIsCropped,
  setCroppedImage,
}: ImageCropperProps) => {
  return (
    <div className="flex flex-col w-full h-[428px] mb-6">
      <div className="relative flex flex-col w-full h-[428px] mb-2">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <Slider
        min={1}
        max={3}
        step={0.1}
        value={[zoom]}
        onValueChange={(value) => onZoomChange(value[0])}
        className="w-1/2 mb-4 self-center"
      />
      <button
        className="bg-[#2f4489] text-white px-4 py-2 rounded"
        onClick={(e) => {
          e.preventDefault();
          const canvas = document.createElement("canvas");
          const img = new Image();
          img.src = image;
          img.onload = () => {
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;
            canvas.width =
              // @ts-ignore
              croppedAreaPixels.width;
            canvas.height =
              // @ts-ignore
              croppedAreaPixels.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(
              img,
              // @ts-ignore
              croppedAreaPixels.x * scaleX,
              // @ts-ignore
              croppedAreaPixels.y * scaleY,
              // @ts-ignore
              croppedAreaPixels.width * scaleX,
              // @ts-ignore
              croppedAreaPixels.height * scaleY,
              0,
              0,
              // @ts-ignore
              croppedAreaPixels.width,
              // @ts-ignore
              croppedAreaPixels.height
            );
            const croppedImage = canvas.toDataURL("image/jpeg");
            setCroppedImage(croppedImage);
            setIsCropped(true);
          };
        }}
      >
        Recortar imagen
      </button>
    </div>
  );
};

export default AddNews;
