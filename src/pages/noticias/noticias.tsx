import "./noticias.css";
import NewsCard from "../../components/News-Card/newscard";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import { useContext, useEffect, useState } from "react";
import { NewsContext } from "../../context/newscontext";
import { Combobox } from "@/components/Combobox/combobox";
import Footer from "@/components/Footer/footer";
import logos from "@/data/footers";
import { getNews } from "@/db/queries";
import { News } from "@/data/news";
const NewsLayout = () => {
  const navigate = useNavigate();
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("NewsLayout must be used within a NewsProvider");
  }
  const [newsData, setNewsData] = useState<News[]>([]);
  useEffect(() => {
    getNews().then((data) => {
      setNewsData(data);
    });
  }, []);

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
          {newsData.slice(0, 3).map((news) => (
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
          <div className="flex flex-row justify-between items-center mb-[16px]">
            <h2 className="text-[20px] font-bold normal-case">
              También te podría interesar
            </h2>
            <div className="flex flex-row gap-[10px]">
              <Combobox
                options={[
                  { value: "enero", label: "Enero" },
                  { value: "febrero", label: "Febrero" },
                  { value: "marzo", label: "Marzo" },
                  { value: "abril", label: "Abril" },
                  { value: "mayo", label: "Mayo" },
                  { value: "junio", label: "Junio" },
                  { value: "julio", label: "Julio" },
                  { value: "agosto", label: "Agosto" },
                  { value: "septiembre", label: "Septiembre" },
                  { value: "octubre", label: "Octubre" },
                  { value: "noviembre", label: "Noviembre" },
                  { value: "diciembre", label: "Diciembre" },
                ]}
                placeholder="Mes"
                popOverWidth="130px"
              />
              <Combobox
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
              />
            </div>
          </div>
          {/*TODO: AGREGAR PAGINACIÓN E INTEGRAR FILTROS*/}
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
      <Footer logos={logos} />
    </div>
  );
};

export default NewsLayout;
