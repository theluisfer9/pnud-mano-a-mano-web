import "./layout.css";
import { useState } from "react";
import LogoutIcon from "@/assets/add-news/box-arrow-left.svg";
import LogoGobierno from "@/assets/navbar/logo_gob_add_new.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";
import BarChart from "@/assets/admin/bar-chart.png";
import Grid from "@/assets/admin/grid.png";
import Users from "@/assets/admin/person-gear.png";
import AdminBulkUploadsSection from "../admin-bulk-uploads/bulk-uploads";
import AdminInterventionsSection from "../admin-interventions/interventions";

interface Section {
  name: string;
  icon: string;
  enabled: boolean;
}
const sections: Section[] = [
  { name: "Dashboard RSH", icon: BarChart, enabled: false },
  { name: "Intervenciones", icon: Grid, enabled: true },
  { name: "Monitoreo Intervenciones", icon: Grid, enabled: false },
  { name: "Reportería", icon: Grid, enabled: false },
  { name: "IPM", icon: Grid, enabled: false },
  { name: "Manejo de Usuarios", icon: Users, enabled: false },
  { name: "Carga de Datos", icon: Grid, enabled: true },
];

const AdminLayout = () => {
  const parsedUser = JSON.parse(
    localStorage.getItem("mano-a-mano-token") || "{}"
  );
  const [activeSection, setActiveSection] = useState(
    sections.filter((section) => section.enabled)[0].name
  );

  return (
    <div className="news-editor">
      <aside className="flex flex-col h-full">
        <div className="flex-grow w-full">
          <div className="user-profile">
            <div className="avatar">
              <img src={parsedUser.pictureUrl} alt="User Avatar" />
            </div>
            <div className="user-info">
              <h2>{parsedUser.name}</h2>
              <p className="user-role">{parsedUser.role}</p>
            </div>
          </div>
          <div
            id="sections-container"
            className="flex w-full flex-col gap-4 mt-4"
          >
            {sections
              .filter((section) => section.enabled)
              .map((section) => (
                <div
                  className="flex w-full justify-start items-center gap-2 cursor-pointer"
                  key={section.name}
                  onClick={() => {
                    setActiveSection(section.name);
                  }}
                >
                  <img src={section.icon} alt={section.name} />
                  <p
                    className={`text-sm text-[#607085] ${
                      activeSection === section.name ? "font-bold" : ""
                    }`}
                  >
                    {section.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <button className="logout-button-admin mt-auto">
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
        <main className="w-full h-full flex flex-col justify-start items-center p-6">
          {activeSection === "Carga de Datos" ? (
            <AdminBulkUploadsSection />
          ) : (
            <AdminInterventionsSection />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
