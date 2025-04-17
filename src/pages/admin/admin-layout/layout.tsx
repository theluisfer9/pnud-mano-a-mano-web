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
import UserManagementSection from "../admin-user-management/user-management";
import InterventionsManagementSection from "../admin-interventions-management/interventions-management";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import bcrypt from "bcryptjs";
import { updateUser } from "@/db/queries";

interface Section {
  name: string;
  icon: string;
  enabled: boolean;
  subsections?: { name: string; id: string }[];
}
const sections: Section[] = [
  { name: "Intervenciones", icon: Grid, enabled: true },
  { name: "Dashboard RSH", icon: BarChart, enabled: true },
  { name: "Monitoreo Intervenciones", icon: Grid, enabled: true },
  { name: "Verificación de intervenciones", icon: Grid, enabled: true },
  { name: "Reportería", icon: Grid, enabled: true },
  { name: "IPM", icon: Grid, enabled: true },
  {
    name: "Manejo de Usuarios",
    icon: Users,
    enabled: true,
    subsections: [
      { name: "Crear Usuario", id: "create-user" },
      { name: "Administrar Usuarios", id: "manage-users" },
    ],
  },
  {
    name: "Administración Intervenciones",
    icon: Grid,
    enabled: true,
    subsections: [
      { name: "Gestión de Programas", id: "interventions-programs" },
      { name: "Gestión de Beneficios", id: "interventions-benefits" },
      { name: "Registro de Fichas", id: "interventions-fichas" },
      { name: "Metas por Intervención", id: "interventions-goals" },
    ],
  },
  {
    name: "Carga de Datos",
    icon: Grid,
    enabled: true,
    subsections: [
      { name: "Carga Masiva (CSV)", id: "bulk-csv" },
      { name: "Digitación de Entregas", id: "interventions-entregas" },
      { name: "Gestión de Intervenciones", id: "bulk-management" },
      { name: "API", id: "bulk-api" },
    ],
  },
];

const AdminLayout = () => {
  const parsedUser = JSON.parse(
    localStorage.getItem("mano-a-mano-token") || "{}"
  );
  const firstEnabledSection = sections.find((section) => section.enabled);
  const firstEnabledSubSection = firstEnabledSection?.subsections?.[0];

  const [activeSection, setActiveSection] = useState<string>(
    firstEnabledSection?.name || ""
  );
  const [activeSubSectionId, setActiveSubSectionId] = useState<string | null>(
    firstEnabledSubSection?.id || null
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    if (firstEnabledSection?.subsections) {
      initialSet.add(firstEnabledSection.name);
    }
    return initialSet;
  });
  const [showPasswordChangeDialog, _setShowPasswordChangeDialog] = useState(
    !parsedUser.hasChangedPassword
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = async () => {
    // First verify the current password
    const check = await bcrypt.compare(currentPassword, parsedUser.password);
    if (!check) {
      alert("La contraseña actual es incorrecta");
      return;
    }
    // Update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await updateUser(parsedUser.id, {
      password: hashedPassword,
      hasChangedPassword: true,
    });
    if (result) {
      alert(
        "Contraseña actualizada correctamente, por favor vuelva a iniciar sesión"
      );
      localStorage.removeItem("mano-a-mano-token");
      window.location.href = "/login";
    } else {
      alert("Error al actualizar la contraseña");
    }
  };

  const handleSectionClick = (sectionName: string) => {
    const section = sections.find((s) => s.name === sectionName);
    if (section?.subsections && section.subsections.length > 0) {
      // Toggle expansion
      const isCurrentlyExpanded = expandedSections.has(sectionName);
      setExpandedSections((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(sectionName)) {
          newSet.delete(sectionName);
        } else {
          newSet.add(sectionName);
          // If expanding, make this section active and its first subsection active
          setActiveSection(sectionName);
          setActiveSubSectionId(section.subsections![0].id);
        }
        return newSet;
      });
      // If collapsing the currently active section, reset active state
      if (isCurrentlyExpanded && activeSection === sectionName) {
        const nextActiveSection = sections.find(
          (s) => s.enabled && s.name !== sectionName
        );
        const nextActiveSubSection = nextActiveSection?.subsections?.[0];
        setActiveSection(nextActiveSection?.name || "");
        setActiveSubSectionId(nextActiveSubSection?.id || null);
        if (nextActiveSection?.subsections) {
          setExpandedSections((prev) =>
            new Set(prev).add(nextActiveSection.name)
          );
        }
      } else if (!isCurrentlyExpanded) {
        // If expanding, make sure it's active
        setActiveSection(sectionName);
        setActiveSubSectionId(section.subsections![0].id);
      }
    } else {
      // Normal section click (no subsections)
      setActiveSection(sectionName);
      setActiveSubSectionId(null); // No subsection active
      setExpandedSections(new Set()); // Collapse others
    }
  };

  const handleSubSectionClick = (sectionName: string, subSectionId: string) => {
    setActiveSection(sectionName);
    setActiveSubSectionId(subSectionId);
  };

  return (
    <div className="news-editor">
      <AlertDialog open={showPasswordChangeDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Cambiar contraseña</AlertDialogTitle>
          <AlertDialogDescription>
            Por favor, ingrese su contraseña actual y nueva para cambiarla.
          </AlertDialogDescription>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded-md border-2 border-[#dedede] p-2"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-md border-2 border-[#dedede] p-2"
          />
          <AlertDialogAction
            onClick={handlePasswordChange}
            className="bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
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
            className="flex w-full flex-col gap-1 mt-4"
          >
            {sections
              .filter((section) => section.enabled)
              .map((section) => (
                <div key={section.name} className="section-item w-full">
                  <div
                    className={`flex w-full justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      activeSection === section.name &&
                      !activeSubSectionId &&
                      !section.subsections
                        ? "bg-gray-200"
                        : activeSection === section.name && section.subsections
                        ? "bg-gray-100"
                        : ""
                    }`}
                    onClick={() => handleSectionClick(section.name)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={section.icon}
                        alt={section.name}
                        className="w-4 h-4 flex-shrink-0"
                      />
                      <p
                        className={`text-sm truncate ${
                          activeSection === section.name &&
                          !activeSubSectionId &&
                          !section.subsections
                            ? "font-bold text-[#2f4489]"
                            : "text-[#607085]"
                        }`}
                      >
                        {section.name}
                      </p>
                    </div>
                    {section.subsections &&
                      section.subsections.length > 0 &&
                      (expandedSections.has(section.name) ? (
                        <ChevronDown
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                      ) : (
                        <ChevronRight
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                      ))}
                  </div>
                  {section.subsections &&
                    expandedSections.has(section.name) && (
                      <div className="subsection-container pl-5 mt-1 flex flex-col gap-1">
                        {section.subsections.map((subsection) => (
                          <div
                            key={subsection.id}
                            className={`flex w-full justify-start items-center p-1.5 rounded cursor-pointer hover:bg-gray-100 ${
                              activeSection === section.name &&
                              activeSubSectionId === subsection.id
                                ? "bg-gray-200"
                                : ""
                            }`}
                            onClick={() =>
                              handleSubSectionClick(section.name, subsection.id)
                            }
                          >
                            <p
                              className={`text-xs truncate ${
                                activeSection === section.name &&
                                activeSubSectionId === subsection.id
                                  ? "font-bold text-[#2f4489]"
                                  : "text-[#607085]"
                              }`}
                            >
                              {subsection.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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
          <div className="header-container flex justify-between items-center">
            <div className="logo-placeholder">
              <img src={LogoGobierno} alt="Logo gobierno" />
            </div>
            <div className="flex flex-col items-center bg-yellow-500 text-black p-2 rounded-md shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  ⚠️ AMBIENTE EN DESARROLLO
                </span>
              </div>
              <p className="text-sm">
                Nota: Considerar que el portal de datos aún está en construcción
              </p>
            </div>
            <div className="logo-placeholder">
              <img src={LogoManoAMano} alt="Logo mano a mano" />
            </div>
          </div>
        </header>
        <main className="w-full h-full flex flex-col justify-start items-start p-6">
          {activeSection === "Carga de Datos" ? (
            <AdminBulkUploadsSection activeSubViewId={activeSubSectionId} />
          ) : activeSection === "Intervenciones" ? (
            <AdminInterventionsSection />
          ) : activeSection === "Manejo de Usuarios" ? (
            <UserManagementSection activeSubViewId={activeSubSectionId} />
          ) : activeSection === "Administración Intervenciones" ? (
            <InterventionsManagementSection
              activeSubViewId={activeSubSectionId}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Seleccione una opción del menú
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
