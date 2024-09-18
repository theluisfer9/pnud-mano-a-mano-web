import "./noticias.css";
import sampleNews from "../../data/news";
import NewsCard from "../../components/News-Card/newscard";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
const NewsLayout = () => {
  return (
    <div className="news-content">
      <section className="news-text">
        <h1>Noticias más recientes</h1>
        <p>
          Aquí encontrarás la{" "}
          <strong>
            información más reciente sobre la Estrategia Intersectorial Mano a
            Mano
          </strong>
          . Nuestro compromiso es mantenerte informado sobre cada paso que damos
          hacia la mejora de la calidad de vida de los guatemaltecos en
          situación de vulnerabilidad.
        </p>
      </section>
      <section className="news-cards">
        {sampleNews.map((news) => (
          <NewsCard
            key={news.picture}
            area={news.area}
            title={news.title}
            imageUrl={news.picture}
            onClick={() => {
              console.log("Clicked on news card");
            }}
          />
        ))}
      </section>
      <section className="news-related">
        <h2>También te podría interesar</h2>
        <div className="related-cards">
          {sampleNews.map((news) => (
            <RelatedNewsCard
              area={news.area}
              title={news.title}
              date={news.date}
              onClick={() => {
                console.log("Clicked on related news card");
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewsLayout;
