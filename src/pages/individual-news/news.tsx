import "./news.css";
import Navbar from "../../components/Navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
import { useContext } from "react";
import { NewsContext } from "../../context/newscontext";
import { News } from "../../data/news";

interface SingleNewsProps {
  news?: News;
}

const SingleNews: React.FC<SingleNewsProps> = ({ news }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("NewsLayout must be used within a NewsProvider");
  }
  const { newsData } = context;
  const findNewsById = (id: number) => {
    return newsData.find((news) => news.id === id);
  };
  const findRelatedNews = (id: number) => {
    // Return 4 or less news that are not the current one
    return newsData.filter((news) => news.id !== id).slice(0, 4);
  };
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
  return (
    <div className="news-layout">
      {id != undefined ? <Navbar activeSection="noticias" /> : null}
      <main className="single-news-content">
        <div className="news-main-container">
          <div className="news-title-container">
            <div className="info-icon"></div>
            <h1>{currentNews.title}</h1>
          </div>
          <img
            id="single-news-main-image"
            src={currentNews.mainImage}
            alt="Main"
          />
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
                {section.image ? (
                  <img
                    id="single-news-extra-image"
                    src={section.image}
                    alt="Extra"
                  />
                ) : null}
                {section.body ? <p>{section.body}</p> : null}
              </div>
            </section>
          );
        })}

      {id != undefined ? (
        <>
          <section className="single-news-related-news">
            <h2>Noticias relacionadas</h2>
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
