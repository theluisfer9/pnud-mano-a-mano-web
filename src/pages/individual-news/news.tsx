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
interface SingleNewsProps {
  news?: News;
}

const SingleNews: React.FC<SingleNewsProps> = ({ news }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const { data: newsData = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const findNewsById = (id: number) => {
    return newsData.find((news) => news.id === id);
  };

  const findRelatedNews = (id: number) => {
    return newsData.filter((news) => news.id !== id).slice(0, 4);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2>Cargando...</h2>
      </div>
    );
  }

  let currentNews = news;
  if (!currentNews) {
    if (id === undefined) {
      return <h2>Noticia no encontrada</h2>;
    }
    currentNews = findNewsById(parseInt(id));
    if (!currentNews) {
      return <h2>Noticia no encontrada</h2>;
    }
  }
  const relatedNews =
    currentNews.state === "published" ? findRelatedNews(currentNews.id) : [];
  useEffect(() => {
    const loadImages = async () => {
      // Load main image
      const mainImageUrl = await handleGetFile(currentNews.mainImage);
      setMainImage(mainImageUrl);

      // Load additional images
      const imagePromises = currentNews.additionalSections
        .filter((section) => section.image)
        .map((section) => handleGetFile(section.image!));

      const additionalImageUrls = await Promise.all(imagePromises);
      setAdditionalImages(additionalImageUrls);
    };
    loadImages();
  }, [currentNews.mainImage, currentNews.additionalSections]);
  return (
    <div className="news-layout">
      {id != undefined ? <Navbar activeSection="noticias" /> : null}
      <main className="single-news-content">
        <div className="news-main-container">
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
          <div className="news-title-container">
            <h1>{currentNews.title}</h1>
          </div>
          <div className="date-area-container">
            <p className="date-area-date">
              {new Date(currentNews.date).toLocaleDateString("es-GT")}
            </p>
            <p className="date-area-area">{currentNews.area}</p>
          </div>
          <img id="single-news-main-image" src={mainImage} alt="Main" />
          <div className="news-tags-container">
            {currentNews.tags?.map((tag, index) => (
              <div className="news-tag" key={index}>
                {tag.tagName}
              </div>
            ))}
          </div>
        </div>
      </main>
      <section className="single-news-subtitle-content">
        <div className="single-news-subtitle-container">
          <h2>{currentNews.subtitle}</h2>
          <p>{currentNews.mainBody}</p>
        </div>
      </section>
      {currentNews.additionalSections &&
        currentNews.additionalSections.map((section, index) => {
          if (!section.body && !section.image) return null;
          return (
            <section key={index} className="single-news-extra-content">
              <div className="single-news-extra-container">
                {section.body ? <p>{section.body}</p> : null}

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
      {(currentNews.externalLinks?.length ?? 0) > 0 && (
        <section className="single-news-external-links">
          <div className="external-links-container">
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
          <section className="single-news-related-news">
            <h2>También te podría interesar...</h2>
            <div className="related-news-container">
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
          </section>
          <Footer logos={logos} />
        </>
      ) : null}
    </div>
  );
};

export default SingleNews;
