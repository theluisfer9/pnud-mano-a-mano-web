import "./noticias.css";
import NewsCard from "../../components/News-Card/newscard";
import RelatedNewsCard from "../../components/Related-News-Card/relatedNewsCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import { Combobox } from "@/components/Combobox/combobox";
import Footer from "@/components/Footer/footer";
import logos from "@/data/footers";
import {
  getBulletins,
  getLifeStories,
  getNews,
  getPressReleases,
} from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LifeStoriesCTA from "@/assets/news/life-stories-cta.jpg";
import { PressRelease } from "@/data/pressrelease";
import PressReleaseCard from "@/components/PressRelease-Card/card";
import { LifeStory } from "@/data/lifestories";
import { Bulletin } from "@/data/bulletins";
import { MinistryBar } from "@/components/Ministry-Bar/ministrybar";
import handleGetFile from "@/services/getfile";
const NewsLayout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: newsData = [] } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const { data: lifeStoriesData = [] } = useQuery({
    queryKey: ["life-stories"],
    queryFn: getLifeStories,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const { data: pressReleasesData = [] } = useQuery({
    queryKey: ["press-releases"],
    queryFn: getPressReleases,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const { data: bulletinsData = [] } = useQuery({
    queryKey: ["bulletins"],
    queryFn: getBulletins,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const [selectedCategory, setSelectedCategory] = useState("Noticias");

  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam) {
      setSelectedCategory(sectionParam);
    }
  }, [searchParams]);

  return (
    <div className="news-layout">
      <Navbar activeSection="noticias" />
      <div className="news-content">
        <div className="flex flex-row justify-center items-center gap-[32px] mt-[32px] max-w-[1440px] px-[16px]">
          {[
            "Noticias",
            "Historias_de_vida",
            "Comunicados_de_prensa",
            "Boletines_mensuales",
          ].map((text) => (
            <div
              key={text}
              className={`flex flex-row justify-center items-center w-[227px] h-[40px] ${
                text === selectedCategory
                  ? "bg-[#2F4489] text-[#F3F4F6] font-bold"
                  : "bg-[#FDFDFF] text-[#A6A6A6] border border-[#E4E4E4] hover:bg-[#F3F4F6] hover:text-[#333333]"
              } rounded-[4px] text-[13px] cursor-pointer`}
              onClick={() => setSelectedCategory(text)}
            >
              {text.replace(/_/g, " ")}
            </div>
          ))}
        </div>
        {selectedCategory === "Noticias" ? (
          <NewsSection newsData={newsData} navigate={navigate} />
        ) : selectedCategory === "Historias_de_vida" ? (
          <LifeStoriesSection
            navigate={navigate}
            lifeStoriesData={lifeStoriesData as LifeStory[]}
          />
        ) : selectedCategory === "Comunicados_de_prensa" ? (
          <PressReleaseSection
            navigate={navigate}
            pressReleasesData={pressReleasesData as PressRelease[]}
          />
        ) : selectedCategory === "Boletines_mensuales" ? (
          <BulletinsSection
            navigate={navigate}
            bulletinsData={bulletinsData as Bulletin[]}
          />
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

  // Get the first 3 news items for the main section, no ministry can be more than once
  const mainNewsCards = newsData.filter(
    (news, index, self) => self.findIndex((t) => t.area === news.area) === index
  );

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
  const currentCards = filteredNews
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(indexOfFirstCard, indexOfLastCard);
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
          hacia la contribución de la reducción de la pobreza y la malnutrición
          en Guatemala.
        </p>
      </section>
      <section className="news-cards">
        {mainNewsCards.map((news) => (
          <div key={news.id} className="w-[calc((100%-48px)/3)]">
            <NewsCard
              key={news.id}
              area={news.area}
              title={news.title}
              imageUrl={news.mainImage}
              onClick={() => navigate(`/noticias/${news.id}`)}
            />
          </div>
        ))}
      </section>
      <section className="news-related">
        <div className="flex flex-row justify-between items-center mb-[32px]">
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
        {/* If a ministry is selected as a filter, show the ministry bar */}
        {selectedMinistry && <MinistryBar ministry={selectedMinistry} />}
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
  lifeStoriesData,
}: {
  navigate: (path: string) => void;
  lifeStoriesData: LifeStory[];
}) => {
  const [cardImages, setCardImages] = useState<string[]>([]);
  useEffect(() => {
    const loadImages = async () => {
      // Load all the images for the cards
      const images = await Promise.all(
        lifeStoriesData.map((story) =>
          story.headerImage.startsWith("data:image")
            ? story.headerImage
            : handleGetFile(story.headerImage)
        )
      );
      setCardImages(images);
    };
    loadImages();
  }, [lifeStoriesData]);
  return (
    <div className="flex flex-col justify-center items-center mt-[32px] px-[16px]">
      <div
        id="life-stories-heading"
        className="flex flex-col justify-start items-start w-full max-w-[1440px] mb-[32px]"
      >
        <h1>Historias de vida</h1>
        <p className="leading-[200%] text-[20px] text-[#667085]">
          Conoce los testimonios de las propias familias, para descubrir de
          manera profunda los cambios y transformaciones que han experimentado a
          través dela Iniciativa Mano a Mano. Estos relatos nos cuentan cómo las
          familias han enfrentado desafíos y se han adaptado a nuevas
          realidades.
        </p>
      </div>
      <div
        id="life-stories-cards"
        className="flex flex-row justify-center items-center w-full max-w-[1440px] gap-[40px]"
      >
        {lifeStoriesData.map((story, index) => (
          <div
            key={story.id}
            className="flex-1 h-[400px] transition-all duration-300 group hover:flex-[2] cursor-pointer relative  rounded-[16px]"
            style={{
              backgroundImage: `url(${cardImages[index]})`,
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
          Te invitamos a sumarte a la Iniciativa Intersectorial Mano a Mano, un
          llamado a la acción para construir comunidades más fuertes, solidarias
          y resilientes. Cada uno de nosotros tiene algo valioso que aportar, y
          al unir nuestras manos, podemos transformar realidades.
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
            ¡Tu apoyo puede transformar vidas!
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
  pressReleasesData,
}: {
  navigate: (path: string) => void;
  pressReleasesData: PressRelease[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // 3 rows × 2 cards per row

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = pressReleasesData.slice(
    indexOfFirstCard,
    indexOfLastCard
  );
  const totalPages = Math.ceil(pressReleasesData.length / cardsPerPage);

  return (
    <div className="flex flex-col justify-center items-center mt-[32px] px-[16px]">
      <div
        id="press-release-heading"
        className="flex flex-col justify-start items-start w-full max-w-[1440px] mb-[32px]"
      >
        <h1>Comunicados de prensa</h1>
        <p className="leading-[200%] text-[20px] text-[#667085]">
          Aquí encontrarás los comunicados de prensa, actualizaciones y todo lo
          relacionado con la Iniciativa Mano a Mano. Cada comunicado refleja el
          impacto que estamos logrando a través de la colaboración y trabajo en
          conjunto con las instituciones de Gobierno y las organizaciones de
          otros sectores.
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
const BulletinsSection = ({
  navigate,
  bulletinsData,
}: {
  navigate: (path: string) => void;
  bulletinsData: Bulletin[];
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [currentBulletinsPage, setCurrentBulletinsPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
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
  // Filter bulletins by month and year if selected
  const filteredBulletins = bulletinsData.filter((bulletin) => {
    const date = new Date(bulletin.date);
    const monthMatch =
      !selectedMonth || date.getMonth() === getMonthIndex(selectedMonth);
    const yearMatch =
      !selectedYear || date.getFullYear().toString() === selectedYear;
    return monthMatch && yearMatch;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentBulletinsPage(1);
  }, [selectedMonth, selectedYear]);

  // Calculate pagination
  const indexOfLastItem = currentBulletinsPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBulletins = filteredBulletins.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalBulletinsPages = Math.ceil(
    filteredBulletins.length / ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col justify-center items-start w-full max-w-[1440px] mt-[32px] px-[16px]">
      <h1>Boletines mensuales</h1>
      <p className="text-[20px] leading-[200%] text-[#667085]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec
        orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit
        tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl,
        iaculis ullamcorper erat ac, aliquam sagittis ex.
      </p>
      <div
        id="filter-container"
        className="flex flex-row w-full justify-end gap-4 mt-4"
      >
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
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
        />
        <Combobox
          options={Array.from({ length: 1 }, (_, i) => i + 2024).map(
            (year) => ({
              value: year.toString(),
              label: year.toString(),
            })
          )}
          placeholder="Año"
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
        />
      </div>
      <div id="bulletins-container" className="flex flex-row w-full gap-4 mt-4">
        {currentBulletins.map((bulletin) => (
          <div
            key={bulletin.id}
            className="flex flex-col w-[calc((100%-16px)/3)] bg-[#F3F4F6] rounded-[8px] p-6 gap-4"
          >
            <span className="text-[14px] text-[#667085]">
              {new Date(bulletin.date).toLocaleDateString("es-GT")}
            </span>
            <span className="text-[20px] font-semibold">{bulletin.title}</span>
            <span
              className="text-[14px] text-[#8B96B2] underline cursor-pointer"
              onClick={() => {
                navigate(`/boletines/${bulletin.id}`);
              }}
            >
              Ver más
            </span>
          </div>
        ))}
      </div>
      {/* Pagination controls */}
      <div className="flex gap-4 items-center justify-end w-full max-w-[1440px] my-8">
        <button
          onClick={() =>
            setCurrentBulletinsPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={currentBulletinsPage === 1}
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
          {Array.from({ length: totalBulletinsPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentBulletinsPage(pageNum)}
                className={`w-10 h-10 rounded-md ${
                  currentBulletinsPage === pageNum
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
            setCurrentBulletinsPage((prev) =>
              Math.min(prev + 1, totalBulletinsPages)
            )
          }
          disabled={currentBulletinsPage === totalBulletinsPages}
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
    </div>
  );
};

export default NewsLayout;
