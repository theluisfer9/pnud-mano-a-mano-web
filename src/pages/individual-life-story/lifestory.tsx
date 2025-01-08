import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/navbar";
import logos from "@/data/footers";
import { LifeStory } from "@/data/lifestories";
import { getLifeStories } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import handleGetFile from "@/services/getfile";
interface LifeStoryProps {
  lifeStory?: LifeStory;
}

const LifeStoryPage: React.FC<LifeStoryProps> = ({ lifeStory }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [headerImageSrc, setHeaderImageSrc] = useState<string>("");
  const [additionalImagesSrcs, setAdditionalImagesSrcs] = useState<string[]>(
    []
  );
  const [videoUrl, setVideoUrl] = useState<string>("");

  const { data: lifeStoriesData = [] } = useQuery({
    queryKey: ["life-stories"],
    queryFn: getLifeStories,
    staleTime: 3 * 60 * 1000,
  });

  const findLifeStoryById = (id: number) => {
    return lifeStoriesData.find((story) => story.id === id);
  };

  let currentLifeStory = lifeStory;
  if (!currentLifeStory && id) {
    currentLifeStory = findLifeStoryById(parseInt(id));
  }

  useEffect(() => {
    if (!currentLifeStory) return;

    const loadResources = async () => {
      const headerImg = currentLifeStory.headerImage.startsWith("data:")
        ? currentLifeStory.headerImage
        : await handleGetFile(currentLifeStory.headerImage);
      setHeaderImageSrc(headerImg);

      const additionalImgs = await Promise.all(
        (currentLifeStory.additionalImages ?? []).map((img) =>
          img.startsWith("data:") ? img : handleGetFile(img)
        )
      );
      setAdditionalImagesSrcs(additionalImgs);

      let video =
        currentLifeStory.videoUrl.startsWith("data:") ||
        currentLifeStory.videoUrl.includes("youtube.com") ||
        currentLifeStory.videoUrl.includes("youtu.be")
          ? currentLifeStory.videoUrl
          : await handleGetFile(currentLifeStory.videoUrl);
      setVideoUrl(video);
    };

    loadResources();
  }, [currentLifeStory]);

  if (!currentLifeStory) {
    return <h2>Historia de vida no encontrada</h2>;
  }

  return (
    <div>
      {id != undefined ? <Navbar activeSection="noticias" /> : null}
      {id != undefined ? (
        <section
          id="breadcrumbs"
          className="flex flex-row items-center gap-2 max-w-[1440px] mx-auto mt-[32px] px-[16px] mobile:px-[32px]"
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
      <main className="flex flex-col items-start justify-center max-w-[1440px] mx-auto my-[32px] px-[16px] mobile:px-[32px]">
        <h1 className="text-[36px] mobile:text-[24px] font-bold text-[#474E5C] ">
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
          {currentLifeStory.videoUrl.includes("youtube.com") ||
          currentLifeStory.videoUrl.includes("youtu.be") ? (
            <iframe
              src={currentLifeStory.videoUrl.replace("watch?v=", "embed/")}
              title="YouTube video player"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <div
          id="content-container"
          className="flex flex-col  items-start justify-center w-full mt-[32px] text-justify"
        >
          <p className="text-[#667085] text-[16px]">
            {currentLifeStory.firstAdditionalBody}
          </p>
          <div className="flex flex-row justify-between w-full mt-[32px] gap-6 mobile:flex-col">
            <img
              src={headerImageSrc}
              alt="Historia de vida"
              className="w-[400px] mobile:w-full mobile:max-w-full max-w-[400px] max-h-[400px] h-auto object-contain"
            />
            <p className="text-[#667085] text-[16px]">
              {currentLifeStory.body}
            </p>
          </div>
          <p className="text-[#667085] text-[16px] mt-[32px]">
            {currentLifeStory.secondAdditionalBody}
          </p>
          <div className="flex flex-row  w-full mt-[32px] gap-6 flex-wrap justify-center">
            {currentLifeStory.additionalImages?.map((_, index: number) => (
              <img
                key={index}
                src={additionalImagesSrcs[index]}
                alt="Historia de vida"
                className={`h-auto max-h-[300px] object-contain ${
                  (additionalImagesSrcs?.length ?? 0) === 2
                    ? "w-[calc(33.333%-16px)]"
                    : (additionalImagesSrcs?.length ?? 0) === 1
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
