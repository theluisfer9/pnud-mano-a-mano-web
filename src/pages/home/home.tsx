// HomeLayout.tsx
import Navbar from "../../components/Navbar/navbar";
import DimensionCard from "../../components/Dimension-Card/card";
import dimensions from "../../data/dimensions";
import "./home.css";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import video from "../../assets/home_video.mp4";
import EmblaCarousel from "@/components/Carousel/Carousel";
import slide1 from "@/assets/carousel_1.png";
import slide2 from "@/assets/carousel_2.png";
import slide3 from "@/assets/carousel_3.png";
import slide5 from "@/assets/carousel_5.png";
import { Button } from "@/components/ui/button";
import BaseMap from "@/assets/home-map/Mapa_Original.svg";
import SololaMap from "@/assets/home-map/Mapa_HoverSolola.svg";
import ChimaltenangoMap from "@/assets/home-map/Mapa_HoverChimaltenango.svg";
import HuehuetenangoMap from "@/assets/home-map/Mapa_HoverHuehuetenango.svg";
import TotonicapanMap from "@/assets/home-map/Mapa_HoverTotonicapan.svg";
import QuicheMap from "@/assets/home-map/Mapa_HoverQuiche.svg";
import manoAManoLogo from "@/assets/logo_mano_a_mano.png";
import { useEffect, useRef, useState } from "react";
interface Slide {
  src: string;
  alt: string;
}

const slides: Slide[] = [
  { src: slide1, alt: "Imagen 1" },
  { src: slide2, alt: "Imagen 2" },
  { src: slide3, alt: "Imagen 3" },
  { src: slide5, alt: "Imagen 5" },
];

const HomeLayout: React.FC = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getMapComponent = () => {
    switch (hoveredRegion) {
      case "solola":
        return SololaMap;
      case "chimal":
        return ChimaltenangoMap;
      case "huehuetenango":
        return HuehuetenangoMap;
      case "toto":
        return TotonicapanMap;
      case "quiche":
        return QuicheMap;
      default:
        return BaseMap;
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
      console.log("Leaving to", relatedTarget.id);
      // if both are not in the svg, then dont do anything
      if (!svgElement.contains(target) && !svgElement.contains(relatedTarget)) {
        return;
      }
      const contained = svgElement.contains(target) ? target : relatedTarget;
    };

    const handleMouseLeaveSecondary = (event: MouseEvent) => {
      console.log("Leaving secondary");
      // If i go from a non contained to a non contained, then dont do anything
      // If i go from a non contained to a contained, then check if the contained is the same as the hoveredRegion, if it is not, then set hoveredRegion to null, if not dont do anything
      // If i go from a contained to a contained also check if both are the same, if not set hoveredRegion to null
      // If i go from a contained to a non contained, check if the contained is the same as the hoveredRegion, if it is not, then set hoveredRegion to null, if not dont do anything
      const target = event.target as SVGPathElement;
      const relatedTarget = event.relatedTarget as SVGPathElement;
      // non contained to non contained
      if (!svgElement.contains(target) && !svgElement.contains(relatedTarget)) {
        return;
      }
      // non contained to contained
      if (!svgElement.contains(target) && svgElement.contains(relatedTarget)) {
        if (relatedTarget.id !== hoveredRegion) {
          setHoveredRegion(null);
        }
      }
      // contained to non contained
      if (svgElement.contains(target) && !svgElement.contains(relatedTarget)) {
        if (target.id !== hoveredRegion) {
          setHoveredRegion(null);
        }
      }
      // contained to contained
      if (svgElement.contains(target) && svgElement.contains(relatedTarget)) {
        if (target.id !== relatedTarget.id) {
          setHoveredRegion(null);
        }
      }
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
      <main className="flex flex-col items-center justify-center px-[64px] py-[40px] w-full">
        <EmblaCarousel slides={slides} />
        <div className="flex flex-row w-[calc(100%+128px)] text-center justify-center items-center bg-[#1C2851] h-[100px] box-border mt-[40px]">
          <span className="text-[#F3F4F6] text-3xl">
            <strong>¡Conoce más de la iniciativa!</strong>
          </span>
        </div>
      </main>
      <section className="home-dimensions">
        <div className="home-dimensions-container">
          <div className="flex flex-row w-auto justify-center items-center text-center">
            <p className="text-[#667085] text-[20px]">
              La iniciativa es un <strong>esfuerzo colaborativo</strong> que
              busca{" "}
              <strong>responder a las necesidades humanas más urgentes</strong>{" "}
              de los y las guatemaltecas en situación de vulnerabilidad. Para
              ello, se definieron 9 dimensiones de trabajo basadas en un{" "}
              <strong>enfoque de derechos</strong>.
            </p>
          </div>
          {dimensions.map((dimension) => (
            <DimensionCard
              key={dimension.id}
              id={dimension.id}
              name={dimension.name}
              image={dimension.image}
              details={dimension.details}
            />
          ))}
        </div>
      </section>
      <section className="rsh">
        <div className="rsh-container">
          <video width="100%" height="750px" controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="flex flex-row w-full h-[660px] gap-[75px]">
            <div className="flex flex-col w-1/2 h-full justify-between">
              <div>
                <h3 className="text-[#101828] text-[36px] font-bold">
                  ¿En qué <strong>lugares de Guatemala</strong> ya existe la
                  Iniciativa intersectorial Mano a Mano?
                </h3>
                <p className="text-[#667085] text-[24px] mt-[24px]">
                  Desplaza el cursor sobre el mapa
                </p>
              </div>
              <div className="flex flex-row w-full h-[102px] bg-[#F3F4F6] rounded-[16px]"></div>
            </div>
            <div className="flex flex-col w-1/2 justify-center items-end">
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
          </div>
          <div className="flex flex-col w-full mt-[24px] align-center">
            <h3 className="text-[#101828] text-[36px] font-bold">
              Vinculación del Registro Social de Hogares y la Iniciativa: Mano a
              mano
            </h3>
            <video width="100%" height="750px" controls className="mt-[24px]">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-[#667085] text-[20px] mt-[24px] leading-8">
              En 2024, se formalizó la creación del{" "}
              <strong>
                Registro Social de Hogares dentro del Ministerio de Desarrollo
                Social
              </strong>
              , con el objetivo de dentro del Ministerio de Desarrollo Social,
              con el objetivo de garantizar su permanencia y uso eficiente para
              orientar los programas sociales. Esta medida permite a las
              distintas instituciones coordinar y priorizar sus acciones de
              manera progresiva, basándose en los{" "}
              <strong>datos de caracterización socioeconómica</strong> de los
              hogares que proporciona el Registro y en la información
              estadística disponible de las entidades participantes.
            </p>
            <p className="text-[#667085] text-[20px] mt-[24px] leading-8 mt-[40px]">
              <strong>Fase 01:</strong> Inicio del proceso de levantamiento de
              datos en areas seleccionadas por sus altos índices de pobreza,
              desnutrición y malnutrición.
            </p>
            <div className="flex flex-row w-full h-auto mt-[24px] gap-[27px]">
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">05</span>
                <span className="text-[24px]">Departamentos</span>
              </div>
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">08</span>
                <span className="text-[24px]">Municipios</span>
              </div>
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">19,714</span>
                <span className="text-[24px]">Hogares</span>
              </div>
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">93,687</span>
                <span className="text-[24px]">Personas</span>
              </div>
            </div>
            <p className="text-[#667085] text-[20px] mt-[24px] leading-8 mt-[40px]">
              <strong>Fase 02:</strong> Se está llevando a cabo un levantamiento
              de información socioeconómica en ciertas áreas a través del RSH a
              partir de junio de 2024.
            </p>
            <div className="flex flex-row w-full h-auto mt-[24px] gap-[27px]">
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">+02</span>
                <span className="text-[24px]">Departamentos</span>
              </div>
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">+12</span>
                <span className="text-[24px]">Municipios</span>
              </div>
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">+142,004</span>
                <span className="text-[24px]">Hogares</span>
              </div>
              <div className="flex flex-col w-1/4 h-[128px] justify-center items-center bg-[#F3F4F6] rounded-[16px]">
                <span className="text-[40px]">+575,925</span>
                <span className="text-[24px]">Personas</span>
              </div>
            </div>
            <div className="flex flex-col w-full h-[568px] mt-[40px] bg-[#F3F4F6] rounded-[16px] pt-[111px] px-[40px] pb-[80px] bg-[url('@/assets/cta_picture.jpg')] bg-cover bg-start justify-between">
              <div className="flex flex-col w-[709px] h-[199px] justify-between">
                <p className="text-[#FFF] text-[40px]">
                  ¡Tu ayuda puede transformar vidas!
                </p>
                <p className="text-[#FFF] text-[40px] font-bold leading-tight">
                  Dona hoy y se parte del cambio <br />
                  que Guatemala necesita.
                </p>
              </div>
              <Button className="w-[237px] h-[48px] bg-[#FFF] text-[#101828] text-[20px] rounded-[4px] hover:bg-[#FFF] hover:text-[#101828]">
                Contribuye hoy
              </Button>
            </div>
            <p className="text-[36px] text-[#474E5C] mt-[36px] leading-tight font-bold">
              Mano a mano es posible gracias a la ayuda de:
            </p>
            <div className="flex flex-row w-full h-[160px] mt-[24px] justify-between">
              <div className="flex flex-col w-1/5 h-[128px] justify-center items-center bg-[#4287f5] rounded-[16px]">
                <span className="text-[40px]">patrocinador</span>
                <span className="text-[24px]">01</span>
              </div>
              <div className="flex flex-col w-1/5 h-[128px] justify-center items-center bg-[#f5e642] rounded-[16px]">
                <span className="text-[40px]">patrocinador</span>
                <span className="text-[24px]">02</span>
              </div>
              <div className="flex flex-col w-1/5 h-[128px] justify-center items-center bg-[#72f542] rounded-[16px]">
                <span className="text-[40px]">patrocinador</span>
                <span className="text-[24px]">03</span>
              </div>
              <div className="flex flex-col w-1/5 h-[128px] justify-center items-center bg-[#42f5d4] rounded-[16px]">
                <span className="text-[40px]">patrocinador</span>
                <span className="text-[24px]">04</span>
              </div>
            </div>
            {/* Updated container to span full viewport width */}
            <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#1C2851] mt-[40px]">
              <div className="flex justify-center items-center h-[100px]">
                <img
                  src={manoAManoLogo}
                  alt="mano-a-mano-logo"
                  className="w-[90px] h-[90px]"
                />
                <span className="text-[#F3F4F6] text-2xl">
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
