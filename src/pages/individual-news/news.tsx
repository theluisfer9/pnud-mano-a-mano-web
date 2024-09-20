import "./news.css";
import Navbar from "../../components/Navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";
import sampleNews from "../../data/news";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";

const SingleNews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (id === undefined) {
    return <h2>Noticia no encontrada</h2>;
  }
  const currentNews = findNewsById(parseInt(id));
  if (currentNews === undefined) {
    return <h2>Noticia no encontrada</h2>;
  }
  const relatedNews = findRelatedNews(parseInt(id));

  return (
    <div className="news-layout">
      <Navbar activeSection="noticias" />
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
          <p>{currentNews.body}</p>
        </div>
      </section>
      {currentNews.firstAdditionalText !== undefined ? (
        <section className="single-news-extra-content">
          <div className="single-news-extra-container">
            {currentNews.firstAdditionalImage !== undefined ? (
              <img
                id="single-news-extra-image"
                src={currentNews.firstAdditionalImage}
                alt="Extra"
              />
            ) : null}
            <p>{currentNews.firstAdditionalText}</p>
          </div>
        </section>
      ) : null}
      {currentNews.secondAdditionalText !== undefined ? (
        <section className="single-news-extra-content">
          <div className="single-news-extra-container">
            {currentNews.secondAdditionalImage !== undefined ? (
              <img
                id="single-news-extra-image"
                src={currentNews.secondAdditionalImage}
                alt="Extra"
              />
            ) : null}
            <p>{currentNews.secondAdditionalText}</p>
          </div>
        </section>
      ) : null}
      {currentNews.thirdAdditionalText !== undefined ? (
        <section className="single-news-extra-content">
          <div className="single-news-extra-container">
            {currentNews.thirdAdditionalImage !== undefined ? (
              <img
                id="single-news-extra-image"
                src={currentNews.thirdAdditionalImage}
                alt="Extra"
              />
            ) : null}
            <p>{currentNews.thirdAdditionalText}</p>
          </div>
        </section>
      ) : null}
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
    </div>
  );
};

const findNewsById = (id: number) => {
  return sampleNews.find((news) => news.id === id);
};
const findRelatedNews = (id: number) => {
  // Return 4 or less news that are not the current one
  return sampleNews.filter((news) => news.id !== id).slice(0, 4);
};

export default SingleNews;
