import LogoGobierno from "@/assets/navbar/logo_gob_add_new.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";
import LogoutIcon from "@/assets/add-news/box-arrow-left.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNews } from "@/db/queries";
import { getLifeStories } from "@/db/queries";
import { getPressReleases } from "@/db/queries";
import { getBulletins } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable/data-table";
import { columns } from "@/components/DataTable/columns";

type DashboardTableData = {
  type: string;
  title: string;
  date: string;
  time: string;
  publisher: string;
  edit: string;
  delete: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const loggedUser = localStorage.getItem("mano-a-mano-token");
    if (!loggedUser) {
      //navigate("/login");
    }
  }, [navigate]);
  const parsedUser = JSON.parse(
    localStorage.getItem("mano-a-mano-token") || "{}"
  );
  // Get every news, life stories, press releases and bulletins with react query
  const { data: newsData = [], isLoading: newsLoading } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const { data: lifeStoriesData = [], isLoading: lifeStoriesLoading } =
    useQuery({
      queryKey: ["life-stories"],
      queryFn: getLifeStories,
      staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
    });
  const { data: pressReleasesData = [], isLoading: pressReleasesLoading } =
    useQuery({
      queryKey: ["press-releases"],
      queryFn: getPressReleases,
      staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
    });
  const { data: bulletinsData = [], isLoading: bulletinsLoading } = useQuery({
    queryKey: ["bulletins"],
    queryFn: getBulletins,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const [mergedData, setMergedData] = useState<DashboardTableData[]>([]);
  useEffect(() => {
    // Only proceed if none of the queries are loading
    if (
      !newsLoading &&
      !lifeStoriesLoading &&
      !pressReleasesLoading &&
      !bulletinsLoading
    ) {
      // Filter and merge the data, keep the columns as type
      const mergedData = [
        ...newsData,
        ...lifeStoriesData,
        ...pressReleasesData,
        ...bulletinsData,
      ].map((item) => ({
        type: (() => {
          if ("subtitle" in item) {
            return "Noticia";
          }
          if ("program" in item) {
            return "Historia de vida";
          }
          if ("category" in item) {
            return "Comunicado de prensa";
          }
          return "Boletín";
        })(),
        title: item.title,
        date: item.date.split("T")[0],
        time: item.date.split("T")[1].split(".")[0],
        publisher: item.publisherid?.toString() || "-1",
        edit: JSON.stringify({
          id: item.id,
          timesedited: item.timesedited,
        }),
        delete: item.id.toString(),
      }));
      setMergedData(mergedData);
    }
  }, [
    newsLoading,
    lifeStoriesLoading,
    pressReleasesLoading,
    bulletinsLoading,
    newsData,
    lifeStoriesData,
    pressReleasesData,
    bulletinsData,
  ]);
  return (
    <div className="dashboard">
      <aside>
        <div className="user-profile">
          <div className="avatar">
            <img src={parsedUser.pictureUrl} alt="User Avatar" />
          </div>
          <div className="user-info">
            <h2>{parsedUser.name}</h2>
            <p className="user-role">{parsedUser.role}</p>
          </div>
        </div>
        <button className="logout-button">
          <span className="logout-icon">
            <LogoutIcon />
          </span>
          <a
            href="#"
            className="logout-text"
            onClick={() => {
              localStorage.removeItem("mano-a-mano-token");
              window.location.href = "/login";
            }}
          >
            Cerrar Sesión
          </a>
        </button>
      </aside>
      <div className="content-wrapper">
        <header>
          <div className="header-container">
            <div className="logo-placeholder">
              <img src={LogoGobierno} alt="Logo gobierno" />
            </div>
            <div className="logo-placeholder">
              <img src={LogoManoAMano} alt="Logo mano a mano" />
            </div>
          </div>
        </header>
        <main>
          <section className="content">
            <div className="flex flex-row justify-between items-center px-11 py-8">
              <h1 className=" text-[36px] font-bold">
                Portal de comunicaciones
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="bg-white shadow-none h-12 text-[#1C2851] text-sm hover:bg-slate-50">
                    <div className="flex flex-row items-center gap-2">
                      Nueva Publicación
                      <ChevronDownIcon />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/nueva-noticia")}
                  >
                    Noticia
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      (window.location.href = "/nueva-historia-de-vida")
                    }
                  >
                    Historia de vida
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      (window.location.href = "/nuevo-comunicado-de-prensa")
                    }
                  >
                    Comunicado de prensa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/nuevo-boletin")}
                  >
                    Boletín
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h2 className="text-[24px] leading-[200%] px-11 m-0 py-0">
              Contenido Publicado
            </h2>
            <div className="flex flex-row justify-between items-center w-full flex-wrap gap-6 px-11">
              <div className="flex flex-row justify-between items-center bg-white rounded-[8px] mt-2 w-[calc(25%-18px)] h-[77px] px-6 text-[14px] text-[#505050] font-medium">
                <span>Noticias</span>
                <span className="text-[24px] font-bold">{newsData.length}</span>
              </div>
              <div className="flex flex-row justify-between items-center bg-white rounded-[8px] mt-2 w-[calc(25%-18px)] h-[77px] px-6 text-[14px] text-[#505050] font-medium">
                <span>Historias de vida</span>
                <span className="text-[24px] font-bold">
                  {lifeStoriesData.length}
                </span>
              </div>
              <div className="flex flex-row justify-between items-center bg-white rounded-[8px] mt-2 w-[calc(25%-18px)] h-[77px] px-6 text-[14px] text-[#505050] font-medium">
                <span>Comunicados de prensa</span>
                <span className="text-[24px] font-bold">
                  {pressReleasesData.length}
                </span>
              </div>
              <div className="flex flex-row justify-between items-center bg-white rounded-[8px] mt-2 w-[calc(25%-18px)] h-[77px] px-6 text-[14px] text-[#505050] font-medium">
                <span>Boletines</span>
                <span className="text-[24px] font-bold">
                  {bulletinsData.length}
                </span>
              </div>
            </div>
            <h2 className="text-[24px] leading-[200%] px-11 m-0 py-0">
              Historial
            </h2>
            <div className="flex flex-row justify-between items-center w-full flex-wrap gap-6 px-11">
              <DataTable columns={columns} data={mergedData} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
