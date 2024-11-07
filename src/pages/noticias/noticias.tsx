import "./noticias.css";
import NewsCard from "../../components/News-Card/newscard";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import { Combobox } from "@/components/Combobox/combobox";
import Footer from "@/components/Footer/footer";
import logos from "@/data/footers";
import { getNews } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { sampleLifeStories } from "@/data/lifestories";
import LifeStoriesCTA from "@/assets/news/life-stories-cta.jpg";
import { pressReleases } from "@/data/pressrelease";
import PressReleaseCard from "@/components/PressRelease-Card/card";
const NewsLayout = () => {
  const navigate = useNavigate();

  const { data: newsData = [] } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const [selectedCategory, setSelectedCategory] = useState("Noticias");

  return (
    <div className="news-layout">
      <Navbar activeSection="noticias" />
      <div className="news-content">
        <div className="flex flex-row justify-center items-center gap-[32px] mt-[32px] max-w-[1440px]">
          {[
            "Noticias",
            "Historias de vida",
            "Comunicados de prensa",
            "Boletines",
          ].map((text) => (
            <div
              key={text}
              className={`flex flex-row justify-center items-center w-[227px] h-[40px] ${
                text === selectedCategory
                  ? "bg-[#2F4489] text-[#F3F4F6]"
                  : "bg-[#FDFDFF] text-[#A6A6A6] border border-[#E4E4E4] hover:bg-[#F3F4F6] hover:text-[#333333]"
              } rounded-[4px] text-[13px] font-bold cursor-pointer`}
              onClick={() => setSelectedCategory(text)}
            >
              {text}
            </div>
          ))}
        </div>
        {selectedCategory === "Noticias" ? (
          <NewsSection newsData={newsData} navigate={navigate} />
        ) : selectedCategory === "Historias de vida" ? (
          <LifeStoriesSection navigate={navigate} />
        ) : selectedCategory === "Comunicados de prensa" ? (
          <PressReleaseSection navigate={navigate} />
        ) : selectedCategory === "Boletines" ? (
          <BulletinsSection />
        ) : null}
      </div>
      <Footer logos={logos} />
    </div>
  );
};

const NewsSection = ({
  newsData,
  navigate,
}: {
  newsData: any[];
  navigate: (path: string) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);
  const cardsPerPage = 8;

  // Get the first 3 news items for the main section (unfiltered)
  const mainNewsCards = newsData.slice(0, 3);

  // Filter news for the second section only

  // Helper function to convert month name to index
  const getMonthIndex = (monthName: string): number => {
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return months.indexOf(monthName);
  };
  const filteredNews = newsData.filter((news) => {
    const matchesMonth = selectedMonth
      ? new Date(news.date).getMonth() === getMonthIndex(selectedMonth)
      : true;
    const matchesMinistry = selectedMinistry
      ? news.area.toLowerCase() === selectedMinistry
      : true;
    return matchesMonth && matchesMinistry;
  });

  // Calculate pagination for filtered results
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredNews.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredNews.length / cardsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedMinistry]);

  return (
    <div>
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
        {mainNewsCards.map((news) => (
          <NewsCard
            key={news.id}
            area={news.area}
            title={news.title}
            imageUrl={news.mainImage}
            onClick={() => navigate(`/noticias/${news.id}`)}
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
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
            />
            <Combobox
              options={[
                { value: "micivi", label: "MICIVI" },
                { value: "mcd", label: "MCD" },
                { value: "mides", label: "MIDES" },
                { value: "mideco", label: "MIDECO" },
                { value: "mintrab", label: "MINTRAB" },
                { value: "maga", label: "MAGA" },
                { value: "mineduc", label: "MINEDUC" },
                { value: "mspas", label: "MSPAS" },
                { value: "mindef", label: "MINDEF" },
                { value: "mem", label: "MEM" },
                { value: "sesan", label: "SESAN" },
              ]}
              placeholder="Ministerio"
              value={selectedMinistry}
              onChange={(value) => setSelectedMinistry(value)}
            />
          </div>
        </div>
        <div className="related-cards">
          {currentCards.map((news) => (
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
        {/* Pagination controls */}
        <div className="flex gap-4 items-center justify-end w-full max-w-[1440px] my-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Anterior
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md ${
                    currentPage === pageNum
                      ? "bg-[#2F4489] text-white"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Siguiente
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};
const LifeStoriesSection = ({
  navigate,
}: {
  navigate: (path: string) => void;
}) => {
  return (
    <div className="flex flex-col justify-center items-center mt-[32px] px-[16px]">
      <div
        id="life-stories-heading"
        className="flex flex-col justify-start items-start w-full max-w-[1440px] mb-[32px]"
      >
        <h1>Historias de vida</h1>
        <p className="leading-[200%] text-[20px] text-[#667085]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec
          orci purus. Duis vel orci non purus pretium efficitur. Praesent
          suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc
          lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.
        </p>
      </div>
      <div
        id="life-stories-cards"
        className="flex flex-row justify-center items-center w-full max-w-[1440px] gap-[40px]"
      >
        {sampleLifeStories.map((story) => (
          <div
            key={story.id}
            className="flex-1 h-[400px] transition-all duration-300 group hover:flex-[2] cursor-pointer relative  rounded-[16px]"
            style={{
              backgroundImage: `url(${story.headerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => {
              navigate(`/historias-de-vida/${story.id}`);
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300 rounded-[16px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-2xl font-bold text-center px-4">
                {story.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div
        id="life-stories-cta"
        className="flex flex-col justify-center items-start w-full max-w-[1440px] my-[32px]"
      >
        <p className="text-[16px] leading-[200%] text-[#667085]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu dui
          ac massa tristique aliquet. Vestibulum vulputate vehicula est et
          lobortis. Praesent sit amet est libero. Vivamus non nunc sem. Ut
          vulputate tincidunt arcu, id ultricies turpis varius ac. Integer
          suscipit, nisi at dapibus blandit, lorem risus malesuada elit, non
          ultricies ex quam non arcu. Nulla facilisi. Cras sit amet finibus
          risus. Suspendisse convallis augue vitae bibendum finibus. Donec vel
          nisl orci. Phasellus ut lacus et nisl egestas tempor ut a arcu. Aenean
          a sapien quis metus iaculis sodales et eget libero.
        </p>
        <div
          className="flex flex-col justify-start items-end w-full h-[568px] max-h-[568px] rounded-[16px] mt-[32px] px-[40px] pt-[111px] pb-[80px]"
          style={{
            backgroundImage: `url(${LifeStoriesCTA})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <span className="text-[34px] text-white">
            ¡Tu ayuda puede transformar vidas!
            <br />
            <br />
          </span>

          <span className="text-[40px] font-bold text-white max-w-[600px] text-end leading-none">
            Contribuye hoy y sé parte del cambio que Guatemala necesita
          </span>
          <button className="bg-white text-[20px] font-semibold text-[#1C2851] px-[49px] py-[12px] rounded-[4px] mt-auto max-h-[48px] flex items-center">
            Súmate ahora
          </button>
        </div>
      </div>
    </div>
  );
};
const PressReleaseSection = ({
  navigate,
}: {
  navigate: (path: string) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // 3 rows × 2 cards per row

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = pressReleases.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(pressReleases.length / cardsPerPage);

  return (
    <div className="flex flex-col justify-center items-center mt-[32px] px-[16px]">
      <div
        id="press-release-heading"
        className="flex flex-col justify-start items-start w-full max-w-[1440px] mb-[32px]"
      >
        <h1>Comunicados de prensa</h1>
        <p className="leading-[200%] text-[20px] text-[#667085]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec
          orci purus. Duis vel orci non purus pretium efficitur. Praesent
          suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc
          lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.
        </p>
      </div>
      {/* Container with justify-between to push cards to edges */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 w-full max-w-[1440px] mb-[32px]">
        {currentCards.map((pressRelease, index) => (
          <div key={index}>
            <PressReleaseCard
              {...pressRelease}
              onClick={() => {
                navigate(`/comunicados/${pressRelease.id}`);
              }}
            />
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex gap-4 items-center justify-end w-full max-w-[1440px] mb-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Anterior
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-md ${
                  currentPage === pageNum
                    ? "bg-[#2F4489] text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
const BulletinsSection = () => {
  return (
    <div className="flex flex-row justify-center items-start w-full max-w-[1440px] mt-[32px] gap-6">
      <div className="flex flex-col justify-center items-start p-[24px] w-1/4 h-auto bg-[#2F4489] rounded-md text-white">
        <span className="text-[36px] font-bold text-white mb-[16px]">
          Boletin 01
        </span>
        <ul className="ml-[16px] mb-[24px] leading-[200%]">
          <li>Tema 1</li>
          <li>Tema 2</li>
          <li>Tema 3</li>
          <li>Tema 4</li>
          <li>Tema 5</li>
        </ul>
        <div className="flex flex-row justify-between items-center w-full">
          <button className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Anterior
          </button>
          <button className="flex items-center gap-2">
            Siguiente
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-3/4 h-full">
        <h1>Tema principal del boletín</h1>
        <div className="flex flex-row justify-start items-start w-full h-[34px] gap-[24px] mb-[24px]">
          <div className="flex justify-center items-center h-full border border-[#AEB4C1] rounded-[4px] p-[8px]">
            Etiqueta 1
          </div>
          <div className="flex justify-center items-center h-full border border-[#AEB4C1] rounded-[4px] p-[8px]">
            Etiqueta 2
          </div>
          <div className="flex justify-center items-center h-full border border-[#AEB4C1] rounded-[4px] p-[8px]">
            Etiqueta 3
          </div>
        </div>
        <p className="text-[16px] text-[#667085] leading-[200%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu dui
          ac massa tristique aliquet. Vestibulum vulputate vehicula est et
          lobortis. Praesent sit amet est libero. Vivamus non nunc sem. Ut
          vulputate tincidunt arcu, id ultricies turpis varius ac. Integer
          suscipit, nisi at dapibus blandit, lorem risus malesuada elit, non
          ultricies ex quam non arcu. Nulla facilisi. Cras sit amet finibus
          risus. Suspendisse convallis augue vitae bibendum finibus. Donec vel
          nisl orci. Phasellus ut lacus et nisl egestas tempor ut a arcu. Aenean
          a sapien quis metus iaculis sodales et eget libero. Proin a felis
          efficitur, scelerisque turpis nec, commodo sapien. Fusce eget purus
          tincidunt, fringilla nisi a, lacinia eros. Maecenas porta diam vel
          vehicula cursus. In lacinia dui vitae ligula vehicula, a vehicula orci
          malesuada. Nullam tempor enim ac urna varius, quis elementum sapien
          ultrices. Aenean nec orci sit amet nulla auctor tincidunt. Morbi
          bibendum scelerisque sagittis. Phasellus vel purus accumsan, tempor
          justo sed, dapibus velit. In ac venenatis orci, sed tincidunt magna.
          Mauris vel turpis ex. Vivamus placerat, elit a fermentum faucibus,
          turpis sapien laoreet nisl, vitae pharetra leo neque nec enim. Quisque
          vitae risus quis felis tristique gravida at ac nisl. Nullam suscipit
          orci vel eros. Donec id nunc vitae magna porta, eu tempus ligula.
          Integer vel felis eu mi ultricies auctor. Curabitur ultricies mi.
          Donec id nunc vitae magna porta, eu tempus ligula. Integer vel felis
          eu mi ultricies auctor. Curabitur ultricies mi.
        </p>
      </div>
    </div>
  );
};
export default NewsLayout;
