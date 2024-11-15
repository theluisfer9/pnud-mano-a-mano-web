import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/navbar";
import logos from "@/data/footers";
import { LifeStory } from "@/data/lifestories";
import { getLifeStories } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

interface LifeStoryProps {
  lifeStory?: LifeStory;
}

const LifeStoryPage: React.FC<LifeStoryProps> = ({ lifeStory }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // TODO: loading state
  const { data: lifeStoriesData = [] } = useQuery({
    queryKey: ["life-stories"],
    queryFn: getLifeStories,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const findLifeStoryById = (id: number) => {
    return lifeStoriesData.find((story) => story.id === id);
  };
  let currentLifeStory = lifeStory;
  if (!currentLifeStory) {
    if (id === undefined) {
      return <h2>Historia de vida no encontrada</h2>;
    }
    currentLifeStory = findLifeStoryById(parseInt(id)) as LifeStory;
    if (!currentLifeStory) {
      return <h2>Historia de vida no encontrada</h2>;
    }
  }
  const additionalImages = JSON.parse(
    // @ts-ignore
    currentLifeStory.additionalImages as string
  );
  return (
    <div>
      {id != undefined ? <Navbar activeSection="noticias" /> : null}
      {id != undefined ? (
        <section
          id="breadcrumbs"
          className="flex flex-row items-center gap-2 max-w-[1440px] mx-auto mt-[32px]"
        >
          <span className="text-[#6B7588] text-[13px]">Noticias</span>
          <span>/</span>
          <span
            className="text-[#2F4489] text-[13px] cursor-pointer"
            onClick={() => navigate("/noticias?section=Historias_de_vida")}
          >
            Historias de vida
          </span>
        </section>
      ) : null}
      <main className="flex flex-col items-start justify-center max-w-[1440px] mx-auto my-[32px]">
        <h1 className="text-[36px] font-bold text-[#474E5C]">
          {currentLifeStory.title}
        </h1>
        <div
          id="date-program"
          className="flex flex-row items-start justify-between w-full"
        >
          <span className="text-[#667085] text-[16px] mt-[16px]">
            {new Date(currentLifeStory.date).toLocaleDateString("es-GT")}
          </span>
          <span className="text-[#667085] text-[16px] mt-[16px]">
            {currentLifeStory.program}
          </span>
        </div>
        <div
          id="video-container"
          className="flex flex-row items-center justify-center w-full h-[718px] mt-[32px] bg-black rounded-[16px]"
        >
          <video
            src={currentLifeStory.videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        </div>
        <div
          id="content-container"
          className="flex flex-col items-start justify-center w-full mt-[32px] text-justify"
        >
          <p className="text-[#667085] text-[16px]">
            {currentLifeStory.firstAdditionalBody}
          </p>
          <div className="flex flex-row justify-between w-full mt-[32px] gap-6">
            <img
              src={currentLifeStory.headerImage}
              alt="Historia de vida"
              className="w-[400px] max-w-[400px] max-h-[400px] h-auto object-contain"
            />
            <p className="text-[#667085] text-[16px]">
              {currentLifeStory.body}
            </p>
          </div>
          <p className="text-[#667085] text-[16px] mt-[32px]">
            {currentLifeStory.secondAdditionalBody}
          </p>
          <div className="flex flex-row w-full mt-[32px] gap-6 flex-wrap justify-center">
            {additionalImages?.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt="Historia de vida"
                className={`h-auto object-contain ${
                  (currentLifeStory.additionalImages?.length ?? 0) === 2
                    ? "w-[calc(33.333%-16px)]"
                    : (currentLifeStory.additionalImages?.length ?? 0) === 1
                    ? "w-[calc(33.333%-16px)]"
                    : "w-[calc(33.333%-16px)]"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
      {id !== undefined && <Footer logos={logos} />}
    </div>
  );
};

export default LifeStoryPage;
