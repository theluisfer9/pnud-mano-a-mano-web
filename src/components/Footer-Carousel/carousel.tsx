import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRenderMobileOrDesktop } from "@/utils/functions";

interface LogoProps {
  src: string;
  alt: string;
}

export default function FooterCarousel({ logos }: { logos: LogoProps[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = logos.length;
  const { isWindowPhone } = useRenderMobileOrDesktop();
  const isMobile = isWindowPhone;
  const visibleItems = isMobile ? 3 : 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }, 3000);

    const handleResize = () => {
      setCurrentIndex(0);
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
      visibleItemsArray.push(logos[index]);
    }
    return visibleItemsArray;
  };

  const centerWidth = isMobile
    ? "calc((100% - 40px) / 3)"
    : "calc((100% - 80px) / 5)";

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-between items-center transition-transform duration-500 ease-in-out gap-2 md:gap-4">
        {getVisibleItems().map((item, index) => {
          const isCenter = index === Math.floor(visibleItems / 2);
          return (
            <div
              key={index}
              style={{ width: centerWidth }}
              className={`flex-none transition-all duration-500 ease-in-out ${
                isCenter ? "scale-105 z-10" : "scale-95 opacity-70"
              }`}
            >
              <Card className="h-[60px] md:h-[80px] border-none shadow-none bg-transparent">
                <CardContent className="flex items-center justify-center p-2 md:p-4 h-full">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={`w-auto h-auto object-contain filter brightness-0 invert ${
                      isCenter ? "h-[40px] md:h-[50px]" : "h-[35px] md:h-[45px]"
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
