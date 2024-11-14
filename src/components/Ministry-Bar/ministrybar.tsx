import FBLogo from "@/assets/social-networks/FB.svg";
import IGLogo from "@/assets/social-networks/Insta.svg";
import TwLogo from "@/assets/social-networks/X.svg";
import TTLogo from "@/assets/social-networks/Tiktok.svg";

interface MinistryBarProps {
  ministry: string;
}

export const MinistryBar = ({ ministry }: MinistryBarProps) => {
  const getLogoRoute = (ministry: string) => {
    switch (ministry) {
      case "mideco":
        return "Ministerio_de_Economia.png";
      case "maga":
        return "Ministerio_de_agricultura.png";
      case "micivi":
        return "Ministerio_de_comunicaciones.png";
      case "mcd":
        return "Ministerio_de_cultura_y_deportes.png";
      case "mindef":
        return "Ministerio_de_defensa.png";
      case "mides":
        return "Ministerio_de_desarrollo.png";
      case "mineduc":
        return "Ministerio_de_educacion.png";
      case "mem":
        return "Ministerio_de_Energia_y_minas.png";
      case "mspas":
        return "Ministerio_de_salud.png";
      case "mintrab":
        return "Ministerio_de_trabajo.png";
      case "sesan":
        return "secretaria_de_salud.png";
      default:
        return "";
    }
  };
  return (
    <div className="flex w-full h-[84px] px-8 py-4 mb-8 rounded-md justify-between items-center bg-[#1C2851] text-white">
      <div className="flex items-center gap-2">
        <img
          src={`./src/assets/footer/${getLogoRoute(ministry)}`}
          alt={ministry}
          className="h-[54px]"
        />
      </div>
      <div id="rrss" className="flex items-center gap-6">
        <svg className="w-8 h-8">
          <FBLogo />
        </svg>
        <svg className="w-8 h-8">
          <IGLogo />
        </svg>
        <svg className="w-8 h-8">
          <TwLogo />
        </svg>
        <svg className="w-8 h-8">
          <TTLogo />
        </svg>
      </div>
    </div>
  );
};
