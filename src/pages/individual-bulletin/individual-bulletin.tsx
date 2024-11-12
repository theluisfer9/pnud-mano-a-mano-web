import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/navbar";
import { Bulletin } from "@/data/bulletins";
import logos from "@/data/footers";
import { getBulletins } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
const BulletinPage = ({ bulletin }: { bulletin: Bulletin }) => {
  const { id } = useParams();
  const { data: bulletinData = [] } = useQuery({
    queryKey: ["bulletins"],
    queryFn: () => getBulletins(),
  });
  const currentBulletin = bulletinData.find((b) => b.id === Number(id));
  if (!currentBulletin?.tags) {
    return <div>No se encontró el boletín</div>;
  }
  const topics = currentBulletin.topics as string[];
  const tags = currentBulletin.tags as string[];
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
          <span className="text-[#2F4489] text-[13px]">Boletines</span>
        </section>
      ) : null}
      <div className="flex flex-row justify-center items-start w-full max-w-[1440px] mt-[32px] mx-auto gap-6">
        <div className="flex flex-col justify-center items-start p-[24px] w-1/4 h-auto bg-[#2F4489] rounded-md text-white">
          <span className="text-[36px] font-bold text-white mb-[16px]">
            Boletin {currentBulletin?.id}
          </span>
          <ul className="ml-[16px] mb-[24px] leading-[200%]">
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
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
          <h1 className="text-[36px] font-bold text-[#474E5C] mb-[16px]">
            {currentBulletin?.title}
          </h1>
          <div className="flex flex-row justify-start items-start w-full h-[34px] gap-[24px] mb-[24px]">
            {tags.map((tag) => (
              <div className="flex justify-center items-center h-full border border-[#AEB4C1] rounded-[4px] p-[8px]">
                {tag}
              </div>
            ))}
          </div>
          <p className="text-[16px] text-[#667085] leading-[200%]">
            {currentBulletin?.body}
          </p>
          {currentBulletin?.mainSecondaryImage ? (
            <img
              src={currentBulletin?.mainSecondaryImage}
              alt="Boletín"
              className="w-full h-auto"
            />
          ) : null}
          <div className="flex justify-between items-center w-full gap-6 mt-4">
            <p>{currentBulletin?.firstAdditionalBody}</p>
            <p>{currentBulletin?.secondAdditionalBody}</p>
          </div>
        </div>
      </div>
      {id !== undefined && <Footer logos={logos} />}
    </div>
  );
};

export default BulletinPage;
