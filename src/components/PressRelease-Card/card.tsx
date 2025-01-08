import defaultImage from "@/assets/news/press-release.webp";
import getFile from "@/services/getfile";
import { useEffect, useState } from "react";

interface PressReleaseCardProps {
  date: string;
  category: string;
  title: string;
  mainImage?: string;
  onClick?: () => void;
  height?: string;
}

const PressReleaseCard = ({
  date,
  category,
  title,
  mainImage = defaultImage,
  onClick,
  height = "192px",
}: PressReleaseCardProps) => {
  const [image, setImage] = useState(mainImage);
  useEffect(() => {
    if (mainImage.includes("data:image")) {
      setImage(mainImage);
    } else {
      getFile(mainImage).then((res) => setImage(res));
    }
  }, [mainImage]);
  return (
    <div
      className="flex flex-row w-full bg-[#F3F4F6] rounded-lg overflow-hidden p-[24px] relative"
      style={{ height: height }}
    >
      {/* Left side - Image */}
      <div className="w-[113px] h-[144px] mr-[15px]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Right side - Content */}
      <div className="flex flex-col flex-1 gap-2">
        <span className="text-[#667085] text-[14px]">{date}</span>
        <span className="text-[#667085] text-[14px] font-medium">
          {category}
        </span>
        <h3 className="text-[#667085] text-[20px] font-bold mt-[8px] line-clamp-1 overflow-hidden">
          {title}
        </h3>
        <span
          className="text-[#667085] text-[14px] cursor-pointer underline mt-auto"
          onClick={onClick}
        >
          Ver más
        </span>
      </div>
    </div>
  );
};

export default PressReleaseCard;
