import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FAOLogo from "@/assets/sponsors/FAO_logo_Blue_3lines_es.jpg";
import UNFPALogo from "@/assets/sponsors/UNFPA_2.png";
import UNICEFLogo from "@/assets/sponsors/UNICEF_ForEveryChild_Cyan_Vertical_RGB_SP.png";
import WBLogo from "@/assets/sponsors/WB-LAC-WBG-Sp-horizontal-black-high.png";
import USAIDLogo from "@/assets/sponsors/USAID_Vert_Spanish_RGB_2-Color.png";
import { useRenderMobileOrDesktop } from "@/utils/functions";

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [FAOLogo, UNFPALogo, UNICEFLogo, WBLogo, USAIDLogo];
  const totalItems = items.length;
  const { isWindowPhone } = useRenderMobileOrDesktop();
  const isMobile = isWindowPhone;
  const visibleItems = isMobile ? 3 : 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }, 3000); // Change slide every 3 seconds

    const handleResize = () => {
      setCurrentIndex(0); // Reset index when screen size changes
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [totalItems]);

  const getVisibleItems = () => {
    let visibleItemsArray = [];
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % totalItems;
      visibleItemsArray.push(items[index]);
    }
    return visibleItemsArray;
  };

  // Adjust widths for mobile and desktop
  const centerWidth = isMobile
    ? "calc((100% - 20px) * 0.5)" // Mobile: 2 gaps of 10px each
    : "calc((100% - 40px) * 0.5)"; // Desktop: 4 gaps of 10px each
  const sideWidth = isMobile
    ? "calc((100% - 20px) * 0.25)"
    : "calc((100% - 40px) * 0.25)";

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-between items-center transition-transform duration-500 ease-in-out gap-2 md:gap-10">
        {getVisibleItems().map((item, index) => {
          const isCenter = index === Math.floor(visibleItems / 2);
          return (
            <div
              key={index}
              style={{ width: isCenter ? centerWidth : sideWidth }}
              className={`flex-none transition-all duration-500 ease-in-out ${
                isCenter ? "scale-105 z-10" : "scale-95 opacity-70"
              }`}
            >
              <Card className="h-[120px] md:h-[200px] border-none shadow-none">
                <CardContent className="flex items-center justify-center p-2 md:p-6 h-full">
                  <img
                    src={item}
                    alt={item}
                    className={`w-full h-auto object-contain ${
                      isCenter
                        ? "max-h-[100px] md:max-h-[140px]"
                        : "max-h-[80px] md:max-h-[120px]"
                    }`}
                  />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
