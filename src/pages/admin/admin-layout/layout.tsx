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
}
const sections: Section[] = [
  { name: "Intervenciones", icon: Grid, enabled: true },
  { name: "Dashboard RSH", icon: BarChart, enabled: true },
  { name: "Monitoreo Intervenciones", icon: Grid, enabled: true },
  { name: "Verificación de intervenciones", icon: Grid, enabled: true },
  { name: "Reportería", icon: Grid, enabled: true },
  { name: "IPM", icon: Grid, enabled: true },
  { name: "Manejo de Usuarios", icon: Users, enabled: true },
  { name: "Carga de Datos", icon: Grid, enabled: true },
];

const AdminLayout = () => {
  const parsedUser = JSON.parse(
    localStorage.getItem("mano-a-mano-token") || "{}"
  );
  const [activeSection, setActiveSection] = useState(
    sections.filter((section) => section.enabled)[0].name
  );
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
        <main className="w-full h-full flex flex-col justify-start items-center p-6">
          {activeSection === "Carga de Datos" ? (
            <AdminBulkUploadsSection />
          ) : activeSection === "Intervenciones" ? (
            <AdminInterventionsSection />
          ) : activeSection === "Manejo de Usuarios" ? (
            <UserManagementSection />
          ) : (
            // TODO: Add other sections
            <></>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
