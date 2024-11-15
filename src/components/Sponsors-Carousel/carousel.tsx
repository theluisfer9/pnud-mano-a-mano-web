import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FAOLogo from "@/assets/sponsors/FAO_logo_Blue_3lines_es.jpg";
import UNFPALogo from "@/assets/sponsors/UNFPA_2.png";
import UNICEFLogo from "@/assets/sponsors/UNICEF_ForEveryChild_Cyan_Vertical_RGB_SP.png";
import WBLogo from "@/assets/sponsors/WB-LAC-WBG-Sp-horizontal-black-high.png";
import USAIDLogo from "@/assets/sponsors/USAID_Vert_Spanish_RGB_2-Color.png";

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [FAOLogo, UNFPALogo, UNICEFLogo, WBLogo, USAIDLogo];
  const totalItems = items.length;
  const visibleItems = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getVisibleItems = () => {
    let visibleItemsArray = [];
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % totalItems;
      visibleItemsArray.push(items[index]);
    }
    return visibleItemsArray;
  };

  // Calculate widths based on the 1.92 ratio and 40px gap
  const centerWidth = "calc((100% - 160px) * 0.2976)"; // 1.92 / (1.92 + 4) * (100% - 4 gaps)
  const sideWidth = "calc((100% - 160px) * 0.1756)"; // 1 / (1.92 + 4) * (100% - 4 gaps)

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-between items-center transition-transform duration-500 ease-in-out">
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
              <Card className="h-[200px] border-none shadow-none">
                <CardContent className="flex items-center justify-center p-6 h-full">
                  <img
                    src={item}
                    alt={item}
                    className={`w-full h-auto object-contain ${
                      isCenter ? "max-h-[140px]" : "max-h-[120px]"
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
