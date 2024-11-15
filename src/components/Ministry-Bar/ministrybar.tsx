import FBLogo from "@/assets/social-networks/FB.svg";
import IGLogo from "@/assets/social-networks/Insta.svg";
import TwLogo from "@/assets/social-networks/X.svg";
import TTLogo from "@/assets/social-networks/Tiktok.svg";
import ministrySocialNetworks from "@/data/ministrysocialnetworks";
import { useEffect, useState } from "react";

interface MinistryBarProps {
  ministry: string;
}

export const MinistryBar = ({ ministry }: MinistryBarProps) => {
  const [logoSrc, setLogoSrc] = useState<string>("");

  const getLogoModule = async (ministry: string) => {
    switch (ministry) {
      case "mideco":
        return (await import("@/assets/footer/Ministerio_de_Economia.png"))
          .default;
      case "maga":
        return (await import("@/assets/footer/Ministerio_de_agricultura.png"))
          .default;
      case "micivi":
        return (
          await import("@/assets/footer/Ministerio_de_comunicaciones.png")
        ).default;
      case "mcd":
        return (
          await import("@/assets/footer/Ministerio_de_cultura_y_deportes.png")
        ).default;
      case "mindef":
        return (await import("@/assets/footer/Ministerio_de_defensa.png"))
          .default;
      case "mides":
        return (await import("@/assets/footer/Ministerio_de_desarrollo.png"))
          .default;
      case "mineduc":
        return (await import("@/assets/footer/Ministerio_de_educacion.png"))
          .default;
      case "mem":
        return (
          await import("@/assets/footer/Ministerio_de_Energia_y_minas.png")
        ).default;
      case "mspas":
        return (await import("@/assets/footer/ministerio_de_salud.png"))
          .default;
      case "mintrab":
        return (await import("@/assets/footer/Ministerio_de_trabajo.png"))
          .default;
      case "sesan":
        return (await import("@/assets/footer/secretaria_de_salud.png"))
          .default;
      default:
        return "";
    }
  };

  useEffect(() => {
    getLogoModule(ministry).then((src) => setLogoSrc(src));
  }, [ministry]);

  const ministryData = ministrySocialNetworks.find(
    (m) => m.name.toLowerCase() === ministry.toLowerCase()
  );
  return (
    <div className="flex w-full h-[84px] px-8 py-4 mb-8 rounded-md justify-between items-center bg-[#1C2851] text-white">
      <div className="flex items-center gap-2">
        <a href={ministryData?.website} target="_blank">
          <img src={logoSrc} alt={ministry} className="h-[54px]" />
        </a>
      </div>
      <div id="rrss" className="flex items-center gap-6">
        {ministryData?.facebook && (
          <a href={ministryData.facebook} target="_blank">
            <svg className="w-8 h-8">
              <FBLogo />
            </svg>
          </a>
        )}
        {ministryData?.instagram && (
          <a href={ministryData.instagram} target="_blank">
            <svg className="w-8 h-8">
              <IGLogo />
            </svg>
          </a>
        )}
        {ministryData?.twitter && (
          <a href={ministryData.twitter} target="_blank">
            <svg className="w-8 h-8">
              <TwLogo />
            </svg>
          </a>
        )}
        {ministryData?.tiktok && (
          <a href={ministryData.tiktok} target="_blank">
            <svg className="w-8 h-8">
              <TTLogo />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};
