// HomeLayout.tsx
import Navbar from "../../components/Navbar/navbar";
import DimensionCard from "../../components/Dimension-Card/card";
import dimensions from "../../data/dimensions";
import "./home.css";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import EmblaCarousel from "@/components/Carousel/Carousel";
import slide1 from "@/assets/home-carousel/1.png";
import slide2 from "@/assets/home-carousel/2.png";
import slide3 from "@/assets/home-carousel/3.png";
import slide4 from "@/assets/home-carousel/4.png";
import slide5 from "@/assets/home-carousel/5.png";
import slide6 from "@/assets/home-carousel/6.png";
import { Button } from "@/components/ui/button";
import BaseMap from "@/assets/home-map/mapa_base.svg";
import SololaMap from "@/assets/home-map/mapa_solola.svg";
import ChimaltenangoMap from "@/assets/home-map/mapa_chimal.svg";
import HuehuetenangoMap from "@/assets/home-map/mapa_huehue.svg";
import TotonicapanMap from "@/assets/home-map/mapa_toto.svg";
import QuicheMap from "@/assets/home-map/mapa_quiche.svg";
import manoAManoLogo from "@/assets/logo_mano_a_mano_2.png";
import manoAManoLogoWhite from "@/assets/navbar/logo_mano_a_mano_2.png";
import { useEffect, useRef, useState } from "react";
import InfoIcon from "@/assets/information.svg";
import SponsorsCarousel from "@/components/Sponsors-Carousel/carousel";
import Timeline from "@/assets/timeline.png";
import GOBLogo from "@/assets/GOBHorizontal-Blanco.png";
import { useRenderMobileOrDesktop } from "@/utils/functions";
interface Slide {
  src: string;
  alt: string;
}

const slides: Slide[] = [
  { src: slide1, alt: "Imagen 1" },
  { src: slide2, alt: "Imagen 2" },
  { src: slide3, alt: "Imagen 3" },
  { src: slide4, alt: "Imagen 4" },
  { src: slide5, alt: "Imagen 5" },
  { src: slide6, alt: "Imagen 6" },
];

const HomeLayout: React.FC = () => {
  const { isWindowPhone } = useRenderMobileOrDesktop();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const getMapComponent = () => {
    switch (hoveredRegion) {
      case "solola":
        return SololaMap;
      case "chimal":
        return ChimaltenangoMap;
      case "huehue":
        return HuehuetenangoMap;
      case "toto":
        return TotonicapanMap;
      case "quiche":
        return QuicheMap;
      default:
        return BaseMap;
    }
  };
  const getRegionColor = () => {
    switch (hoveredRegion) {
      case "huehue":
        return "#FFC130";
      case "chimal":
        return "#FFC130";
      case "quiche":
        return "#EF1746";
      case "toto":
        return "#2F5597";
      case "solola":
        return "#71AD47";
      default:
        return "transparent";
    }
  };
  const getRegionFormalName = () => {
    switch (hoveredRegion) {
      case "huehue":
        return "Huehuetenango";
      case "quiche":
        return "Quiché";
      case "toto":
        return "Totonicapán";
      case "solola":
        return "Sololá";
      case "chimal":
        return "Chimaltenango";
      default:
        return "N/A";
    }
  };
  const getRegionActiveMunicipios = () => {
    switch (hoveredRegion) {
      case "huehue":
        return ["San Gaspar Ixchil", "Santiago Chimaltenango", "Colotenango"];
      case "quiche":
        return ["San Bartolomé Jocotenango"];
      case "toto":
        return ["Santa Lucía la Reforma"];
      case "solola":
        return ["Santa Cruz la Laguna"];
      case "chimal":
        return ["Santa Apolonia"];
      default:
        return [];
    }
  };
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as SVGPathElement;
      if (!target.closest("#Mapa_original")) return;
      if (!target.id) return;
      setHoveredRegion(target.id);
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as SVGPathElement;
      const target = event.target as SVGPathElement;

      // Check if we're staying within the same region
      // if target has cls-4 then set hoveredRegion to null
      if (relatedTarget.classList.contains("cls-4")) {
        setHoveredRegion(null);
        return;
      }
      if (
        hoveredRegion == "toto" &&
        relatedTarget.classList.contains("cls-5")
      ) {
        setHoveredRegion(null);
        return;
      }
      // if in huehue or chimal, cls-5 to cls-7 does not set the hoveredRegion to null
      if (hoveredRegion == "huehue" || hoveredRegion == "chimal") {
        if (
          (target.classList.contains("cls-5") ||
            target.classList.contains("cls-7")) &&
          (relatedTarget.classList.contains("cls-5") ||
            relatedTarget.classList.contains("cls-7"))
        ) {
          return;
        }
      }
      // if in quiche, cls-5 to cls-6 does not set the hoveredRegion to null
      if (hoveredRegion == "quiche") {
        if (
          (target.classList.contains("cls-5") ||
            target.classList.contains("cls-6")) &&
          (relatedTarget.classList.contains("cls-5") ||
            relatedTarget.classList.contains("cls-6"))
        ) {
          return;
        }
      }
      // if in solola or toto cls-3 or cls-6 does not set the hoveredRegion to null
      if (hoveredRegion == "solola" || hoveredRegion == "toto") {
        if (
          (target.classList.contains("cls-3") ||
            target.classList.contains("cls-6")) &&
          (relatedTarget.classList.contains("cls-3") ||
            relatedTarget.classList.contains("cls-6"))
        ) {
          return;
        }
      }
      if (hoveredRegion && ["solola", "toto"].includes(hoveredRegion)) {
        // if current and relatedTarget are cls-3 or cls-5, dont set hoveredRegion to null
        if (
          (target.classList.contains("cls-3") ||
            target.classList.contains("cls-5")) &&
          (relatedTarget.classList.contains("cls-3") ||
            relatedTarget.classList.contains("cls-5"))
        ) {
          console.log("staying within the same region");
          return;
        }
      } else if (
        (target.classList.contains("cls-4") ||
          target.classList.contains("cls-5")) &&
        (relatedTarget.classList.contains("cls-4") ||
          relatedTarget.classList.contains("cls-5"))
      ) {
        return;
      }
      setHoveredRegion(null);
    };

    // Remove existing listeners to avoid duplicate attachments
    const removeEventListeners = () => {
      const paths = svgElement.querySelectorAll("path");
      paths.forEach((path) => {
        path.removeEventListener("mouseenter", handleMouseEnter);
        path.removeEventListener("mouseleave", handleMouseLeave);
      });
    };

    // Attach event listeners to each path within the SVG with id "Mapa_original"
    const attachEventListeners = () => {
      const paths = svgElement.querySelectorAll("path");
      paths.forEach((path) => {
        path.addEventListener("mouseenter", handleMouseEnter);
        path.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    // Remove old event listeners and attach new ones whenever the hoveredRegion changes
    removeEventListeners();
    attachEventListeners();

    // Cleanup function to remove event listeners
    return () => {
      removeEventListeners();
    };
  }, [hoveredRegion]);
  const MapComponent = getMapComponent();
  return (
    <div className="home-layout">
      <Navbar activeSection="home" />
      <main className="flex flex-col items-center justify-center px-4 md:px-[64px] py-[40px] w-full">
        <EmblaCarousel slides={slides} />
        <div className="flex flex-row w-[calc(100%+32px)] md:w-[calc(100%+128px)] text-center justify-center items-center bg-[#1C2851] h-[100px] box-border mt-[40px]">
          <span className="text-[#F3F4F6] text-3xl">
            <strong>¡Conoce más sobre la iniciativa!</strong>
          </span>
        </div>
      </main>
      <section className="home-dimensions md:px-[64px]" id="dimensiones">
        <div className="home-dimensions-container">
          <div className="flex flex-col w-auto justify-center items-center text-center gap-4">
            <p className="text-[#667085] text-[20px]">
              La iniciativa es un <strong>esfuerzo colaborativo</strong> que
              busca{" "}
              <strong>responder a las necesidades humanas más urgentes</strong>{" "}
              de los y las guatemaltecas <br />
              en situación de vulnerabilidad. Para ello, se definieron 9
              dimensiones de trabajo basadas en un{" "}
              <strong>enfoque de derechos humanos</strong>.
            </p>
            <p className="text-[#667085] text-[20px]">
              Haz <strong>clic en cada dimensión</strong> para obtener más
              información.
            </p>
          </div>
          {dimensions.map((dimension) => (
            <DimensionCard
              key={dimension.id}
              id={dimension.id}
              name={dimension.name}
              image={dimension.image}
              details={dimension.details}
              linkUrl={dimension.linkUrl}
            />
          ))}
          <div className="flex flex-row w-auto justify-center items-center text-center">
            <p className="text-[#667085] text-[20px]">
              Mano a Mano tiene como objetivo{" "}
              <strong>
                crear hogares saludables que propicien la salud y el desarrollo
              </strong>{" "}
              de sus miembros y de sus comunidades.
              <br /> Esto significa asegurar prioritariamente la salud de las
              madres y de los niños y niñas de cada hogar. Significa también,
              apoyar a cada familia para que tenga acceso a una vivienda
              saludable, acceso a servicios básicos (educación, agua,
              saneamiento, etc.), acceso a alimento y a oportunidades de empleo.
            </p>
          </div>
        </div>
      </section>
      <section className="rsh">
        <div
          id="manoamano"
          className="flex flex-col items-center justify-center px-4 md:px-[64px] w-full"
        >
          <div className="video-wrapper mb-[32px]">
            <iframe
              src="https://www.youtube.com/embed/k2eNhVQYGCw?si=KQmhzsD6xVjbhCtw"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div id="lugares" className="flex flex-col w-full md:h-[660px] gap-6">
            <h3 className="text-[#474E5C] text-[28px] md:text-[36px] leading-tight text-center">
              ¿En qué <strong>territorios de Guatemala</strong> ya existe la
              Iniciativa intersectorial Mano a Mano?
            </h3>
            <div className="flex flex-col md:flex-row w-full gap-6">
              <div className="flex flex-col w-full md:w-[45%] md:order-2 justify-center items-center md:items-end h-[400px] md:h-auto">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 1000"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <MapComponent />
                </svg>
              </div>
              <div className="flex flex-col w-full md:w-[55%] md:order-1 justify-center">
                <div className="flex flex-col gap-4">
                  {!isWindowPhone && (
                    <>
                      <p className="text-[#667085] text-[24px]">
                        Desplaza el cursor sobre el mapa
                      </p>
                      <div
                        className="p-[8px] text-[#FFF] w-fit rounded-[8px] flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: getRegionColor() }}
                      >
                        {getRegionFormalName()}
                      </div>
                      <div className="min-h-[80px]">
                        <ul className="list-disc list-outside ml-[16px]">
                          {getRegionActiveMunicipios().map((municipio) => (
                            <li key={municipio}>{municipio}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-row w-full items-start min-h-[116px] bg-[#F3F4F6] rounded-[16px] p-[16px] gap-[16px] mt-4">
                  <div className="flex-shrink-0 mt-1">
                    <InfoIcon />
                  </div>
                  <p className="flex-1 text-[#667085] text-xs leading-5">
                    Para la Iniciativa Intersectorial Mano a Mano se han
                    <strong> priorizado</strong> en el período 2024-2028:
                    <br />
                    <br />
                    <span className="inline-block">
                      114 municipios de los departamentos de Alta Verapaz (12),
                      Chiquimula (5), Huehuetenango (28), Quiché (18), Sololá
                      (13), Totonicapán (8), Chimaltenango (7), San Marcos (11),
                      Jalapa (3) y Quetzaltenango (9), donde se concentran las
                      mayores condiciones de vulnerabilidad nutricional,
                      económica y social.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="registro"
            className="flex flex-col w-full mt-[24px] align-center px-4 md:px-0"
          >
            <h3 className="text-[#474E5C] text-[28px] md:text-[36px] mb-4 text-center">
              El Registro Social de Hogares <strong>es la brújula</strong> de la
              Iniciativa Mano a Mano
            </h3>
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/U-lZtF8f430?si=qVlTKox5oSN7dh_e"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-[#667085] text-[16px] md:text-[20px] leading-[200%] my-6 text-center">
              En 2024, se formalizó la creación del <strong>RSH</strong>, con el
              objetivo de garantizar su permanencia y uso eficiente para
              orientar los programas sociales. Esta medida permite a las
              distintas instituciones coordinar y priorizar sus acciones de
              manera progresiva, basándose en los{" "}
              <strong>datos de caracterización socioeconómica</strong> de los
              hogares que proporciona el Registro y en la información
              estadística disponible de las entidades participantes.
            </p>
            <div className="my-8 w-full">
              <div className="overflow-x-auto md:overflow-hidden">
                <img
                  src={Timeline}
                  alt="timeline"
                  className="w-full min-w-[800px] md:min-w-0 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col w-full min-h-[400px] md:min-h-[568px] mt-[40px] bg-[#F3F4F6] rounded-[16px] relative overflow-hidden">
              {/* Background image container */}
              <div
                className="absolute inset-0 bg-[url('@/assets/cta_picture.jpg')] bg-cover bg-center"
                aria-hidden="true"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Content container */}
              <div className="relative z-10 flex flex-col h-full justify-between p-6 md:p-12">
                <div className="flex flex-col gap-6 md:gap-8">
                  <p className="text-white text-2xl md:text-4xl lg:text-5xl font-medium leading-tight">
                    ¡El cambio sucede cuando <br className="hidden md:block" />{" "}
                    trabajamos <strong>Mano a Mano</strong>!
                  </p>
                  <p className="text-white text-xl md:text-2xl lg:text-3xl">
                    ¿Te gustaría apoyar en la iniciativa?
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
                  <Button
                    className="w-full md:w-auto px-8 h-12 bg-white text-[#1C2851] text-lg font-medium rounded hover:bg-gray-100 hover:text-[#101828] transition-colors"
                    onClick={() =>
                      window.open(
                        "https://ee.kobotoolbox.org/x/zxCnXKZC",
                        "_blank"
                      )
                    }
                  >
                    Súmate ahora
                  </Button>
                  <img
                    src={manoAManoLogoWhite}
                    alt="mano-a-mano-logo"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  />
                </div>
              </div>
            </div>
            <p className="text-[28px] md:text-[36px] text-[#474E5C] mt-[36px] leading-tight text-center">
              Se han <strong>sumado</strong> a la Iniciativa por parte de
              Cooperación Internacional:
            </p>
            <div className="flex flex-row w-full h-[120px] md:h-[160px] mt-[32px] justify-between">
              <SponsorsCarousel />
            </div>
            <div className="relative p-4 w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#1C2851] mt-[40px]">
              <div className="flex flex-col md:flex-row justify-center items-center min-h-[100px] gap-6 py-4">
                <img
                  src={GOBLogo}
                  alt="gob-logo"
                  className="w-[65px] h-[65px] md:w-[85px] md:h-[85px]"
                />
                <img
                  src={manoAManoLogo}
                  alt="mano-a-mano-logo"
                  className="w-[55px] h-[56.5px] md:w-[75px] md:h-[76.5px]"
                />
                <span className="text-[#F3F4F6] text-xl md:text-2xl text-center">
                  <strong>
                    El principio del fin de la pobreza y la malnutrición en
                    Guatemala
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer logos={logos} />
    </div>
  );
};

export default HomeLayout;
