import "./noticias.css";
import NewsCard from "../../components/News-Card/newscard";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import { useContext } from "react";
import { NewsContext } from "../../context/newscontext";
const NewsLayout = () => {
  const navigate = useNavigate();
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("NewsLayout must be used within a NewsProvider");
  }

  const { newsData } = context;
  return (
    <div className="news-layout">
      <Navbar activeSection="noticias" />
      <div className="news-content">
        <section className="news-text">
          <h1>Noticias más recientes</h1>
          <p>
            Aquí encontrarás la{" "}
            <strong>
              información más reciente sobre la Estrategia Intersectorial Mano a
              Mano
            </strong>
            . Nuestro compromiso es mantenerte informado sobre cada paso que
            damos hacia la mejora de la calidad de vida de los guatemaltecos en
            situación de vulnerabilidad.
          </p>
        </section>
        <section className="news-cards">
          {newsData
            .slice(1)
            .slice(-3)
            .map((news) => (
              <NewsCard
                key={news.id}
                area={news.area}
                title={news.title}
                imageUrl={news.mainImage}
                onClick={() => {
                  navigate(`/noticias/${news.id}`);
                }}
              />
            ))}
        </section>
        <section className="news-related">
          <h2>También te podría interesar</h2>
          <div className="related-cards">
            {newsData.map((news) => (
              <RelatedNewsCard
                key={news.id}
                area={news.area}
                title={news.title}
                date={news.date}
                onClick={() => {
                  navigate(`/noticias/${news.id}`);
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsLayout;
