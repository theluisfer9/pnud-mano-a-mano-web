import "./news.css";
import Navbar from "../../components/Navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
import { useQuery } from "@tanstack/react-query";
import { News } from "../../data/news";
import { getNews } from "@/db/queries";
import { useEffect, useState } from "react";
import handleGetFile from "../../services/getfile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface SingleNewsProps {
  news?: News;
}

const SingleNews: React.FC<SingleNewsProps> = ({ news }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [mediaDisplay, setMediaDisplay] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: newsData = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const [currentNews, setCurrentNews] = useState<News | undefined>(news);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);

  useEffect(() => {
    if (!news && id) {
      const foundNews = newsData.find((n) => n.id === parseInt(id));
      setCurrentNews(foundNews);

      if (foundNews?.state === "PUBLISHED") {
        const related = newsData
          .filter((n) => n.id !== foundNews.id)
          .slice(0, 4);
        setRelatedNews(related);
      }
    }
  }, [news, id, newsData]);

  useEffect(() => {
    if (!currentNews) return;

    const loadImages = async () => {
      // Load main image
      const mainImageUrl =
        currentNews.mainImage.startsWith("data:image") ||
        currentNews.mainImage.startsWith("blob")
          ? currentNews.mainImage
          : await handleGetFile(currentNews.mainImage);
      setMainImage(mainImageUrl);

      // Load additional images
      const imagePromises = currentNews.additionalSections
        .filter((section) => section.image)
        .map((section) =>
          section.image!.startsWith("data:image") ||
          section.image!.startsWith("blob")
            ? section.image
            : handleGetFile(section.image!)
        );

      const additionalImageUrls = await Promise.all(imagePromises);
      setAdditionalImages(
        additionalImageUrls.filter((url) => url !== null) as string[]
      );
      // Load media display
      const mediaDisplayPromises = currentNews.mediaDisplay
        .filter((media) => media.image || media.video)
        .map((media) => {
          if (media.image) {
            return media.image.startsWith("data:image") ||
              media.image.startsWith("blob")
              ? media.image
              : handleGetFile(media.image);
          } else if (media.video) {
            return media.video.includes("youtube.com") ||
              media.video.includes("youtu.be")
              ? media.video
              : "";
          }
          return "";
        });
      const mediaDisplayUrls = await Promise.all(mediaDisplayPromises);

      setMediaDisplay(mediaDisplayUrls.filter((url) => url !== null));
    };

    loadImages();
  }, [currentNews]);

  const handleMediaClick = (media: string) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (!currentNews) {
    return <h2>Noticia no encontrada</h2>;
  }

  return (
    <div className="news-layout ">
      {id != undefined ? <Navbar activeSection="noticias" /> : null}
      <main className="single-news-content  mobile:w-full">
        <div className="news-main-container mobile:mx-[32px]">
          {id != undefined ? (
            <section
              id="breadcrumbs"
              className="flex flex-row items-center gap-2 max-w-[1440px] mx-auto mb-[24px]"
            >
              <span className="text-[#6B7588] text-[13px]">Noticias</span>
              <span>/</span>
              <span
                className="text-[#2F4489] text-[13px] cursor-pointer"
                onClick={() => navigate("/noticias?section=Noticias")}
              >
                Noticias
              </span>
            </section>
          ) : null}
          <div className="news-title-container ">
            <h1 className="text-[36px] mobile:text-[24px]">
              {currentNews.title}
            </h1>
          </div>
          <div className="date-area-container">
            <p className="date-area-date">
              {new Date(currentNews.date).toLocaleDateString("es-GT")}
            </p>
            <p className="date-area-area">{currentNews.area}</p>
          </div>
          <img id="single-news-main-image" src={mainImage} alt="Main" />
          <div className="news-tags-container mobile:grid  mobile:w-full mobile:justify-center mobile:items-center mobile:grid-cols-3">
            {currentNews.tags?.map((tag, index) => (
              <div className="news-tag" key={index}>
                {tag.tagName}
              </div>
            ))}
          </div>
        </div>
      </main>
      <section className="single-news-subtitle-content">
        <div className="single-news-subtitle-container mobile:mx-[32px] ">
          <h2>{currentNews.subtitle}</h2>
          <p>{currentNews.mainBody}</p>
        </div>
      </section>
      {currentNews.additionalSections &&
        currentNews.additionalSections.map((section, index) => {
          if (!section.body && !section.image) return null;
          return (
            <section key={index} className="single-news-extra-content ">
              <div className="single-news-extra-container mobile:w-full mobile:px-[32px] ">
                {section.body ? (
                  <p className="mobile:mx-[32px] mobile:text-justify">
                    {section.body}
                  </p>
                ) : null}

                {section.image ? (
                  <img
                    id="single-news-extra-image"
                    src={additionalImages[index]}
                    alt="Extra"
                  />
                ) : null}
              </div>
            </section>
          );
        })}
      {mediaDisplay.length > 0 && (
        <section className="single-news-media-display mb-6">
          <div className="flex flex-row gap-4">
            {mediaDisplay.map((media, index) => (
              <div
                key={index}
                className="h-[300px] w-full cursor-pointer"
                onClick={() => handleMediaClick(media)}
              >
                {media.includes("youtube.com") || media.includes("youtu.be") ? (
                  <iframe
                    src={media.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={media}
                    alt="Media"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {(currentNews.externalLinks?.length ?? 0) > 0 && (
        <section className="single-news-external-links">
          <div className="external-links-container mobile:mx-[32px] text-justify">
            <p>
              Podrás encontrar más información en los siguientes enlaces:{"  "}
              {currentNews.externalLinks?.map((link) => (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              ))}
            </p>
          </div>
        </section>
      )}
      {id != undefined ? (
        <>
          <section className="single-news-related-news ">
            <div className="mobile:w-full">
              <h2>También te podría interesar...</h2>
              <div className="related-news-container mobile:flex-col mobile:mx-[32px]">
                {relatedNews.map((news) => (
                  <RelatedNewsCard
                    key={news.id}
                    title={news.title}
                    area={news.area}
                    date={news.date}
                    onClick={() => {
                      navigate(`/noticias/${news.id}`);
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
          <Footer logos={logos} />
        </>
      ) : null}

      {/* Modal for displaying larger media */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] bg-white p-0 overflow-hidden">
          <DialogTitle className="text-black p-6">Multimedia</DialogTitle>
          {selectedMedia &&
            (selectedMedia.includes("youtube.com") ||
            selectedMedia.includes("youtu.be") ? (
              <iframe
                src={selectedMedia.replace("watch?v=", "embed/")}
                title="YouTube video player"
                className="w-full h-[80vh]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-[80vh] flex items-center justify-center bg-white">
                <img
                  src={selectedMedia}
                  alt="Media"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleNews;
