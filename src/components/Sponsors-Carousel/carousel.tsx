import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
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
              <Card
                className={`h-full mx-5 ${
                  isCenter
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <CardContent className="flex items-center justify-center p-6">
                  <span
                    className={`font-semibold ${
                      isCenter ? "text-6xl" : "text-4xl"
                    }`}
                  >
                    {item}
                  </span>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
