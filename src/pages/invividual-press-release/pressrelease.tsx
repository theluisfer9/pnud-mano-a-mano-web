import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/navbar";
import PressReleaseCard from "@/components/PressRelease-Card/card";
import logos from "@/data/footers";
import { PressRelease } from "@/data/pressrelease";
import { pressReleases } from "@/data/pressrelease";
import { useParams, useNavigate } from "react-router-dom";

interface PressReleaseProps {
  pressRelease?: PressRelease;
}

const PressReleasePage: React.FC<PressReleaseProps> = ({ pressRelease }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  let currentPressRelease = pressRelease;
  if (!currentPressRelease) {
    if (id === undefined) {
      return <h2>Historia de vida no encontrada</h2>;
    }
    currentPressRelease = pressReleases.find(
      (release) => release.id === parseInt(id)
    );
    if (!currentPressRelease) {
      return <h2>Comunicado de prensa no encontrado</h2>;
    }
  }
  const currentIndex = pressReleases.findIndex(
    (release) => release.id === currentPressRelease.id
  );
  const relatedReleases = [];

  if (currentIndex === 0) {
    // If first item, get next 2
    relatedReleases.push(
      ...pressReleases.slice(currentIndex + 1, currentIndex + 3)
    );
  } else if (currentIndex === pressReleases.length - 1) {
    // If last item, get previous 2
    relatedReleases.push(
      ...pressReleases.slice(currentIndex - 2, currentIndex)
    );
  } else {
    // Get previous and next
    relatedReleases.push(pressReleases[currentIndex - 1]);
    relatedReleases.push(pressReleases[currentIndex + 1]);
  }

  // TODO: loading state

  return (
    <div>
      {id != undefined ? <Navbar activeSection="noticias" /> : null}
      <section
        id="breadcrumbs"
        className="flex flex-row items-center gap-2 max-w-[1440px] mx-auto mt-[32px]"
      >
        <span className="text-[#6B7588] text-[13px]">Noticias</span>
        <span>/</span>
        <span className="text-[#2F4489] text-[13px]">
          Comunicados de prensa
        </span>
      </section>
      <main className="flex flex-col items-start justify-center max-w-[1440px] mx-auto my-[32px]">
        <h1 className="text-[36px] font-bold text-[#474E5C]">
          {currentPressRelease.title}
        </h1>
        <div
          id="date-program"
          className="flex flex-row items-start justify-between w-full"
        >
          <span className="text-[#667085] text-[16px] mt-[16px]">
            {new Date(currentPressRelease.date).toLocaleDateString("es-GT")}
          </span>
          <span className="text-[#667085] text-[16px] mt-[16px]">
            {currentPressRelease.category}
          </span>
        </div>
        <div
          id="content-container"
          className="flex flex-col items-start justify-center w-full mt-[32px] text-justify"
        >
          <p className="text-[#667085] text-[16px]">
            {currentPressRelease.body}
          </p>
        </div>
        <div
          id="pdf-container"
          className="flex flex-row items-center justify-center w-full h-auto mt-[32px] rounded-[16px]"
        >
          <iframe
            src={currentPressRelease.pdfSource}
            className="w-[90%] h-[1154px]"
          />
        </div>
      </main>
      <section
        id="related-releases"
        className="flex flex-col items-start justify-center max-w-[1440px] mx-auto my-[32px]"
      >
        <span className="text-[20px] font-bold leading-[200%] text-[#474E5C] mb-[16px]">
          También te podría interesar...
        </span>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 w-full">
          {relatedReleases.map((release) => (
            <PressReleaseCard
              {...release}
              onClick={() => {
                navigate(`/comunicados/${release.id}`);
              }}
            />
          ))}
        </div>
      </section>
      <Footer logos={logos} />
    </div>
  );
};

export default PressReleasePage;
