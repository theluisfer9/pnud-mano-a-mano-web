import React, { useState, useEffect } from "react";
import "./newscard.css";
import handleGetFile from "@/services/getfile";

interface NewsCardProps {
  imageUrl: string;
  area: string;
  title: string;
  onClick: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  imageUrl,
  area,
  title,
  onClick,
}) => {
  const [imageData, setImageData] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (imageUrl.startsWith("data:image")) {
          setImageData(imageUrl);
        } else {
          const dataUrl = await handleGetFile(imageUrl);
          setImageData(dataUrl);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
    loadImage();

    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [imageUrl]);

  return (
    <div
      className="news-card w-full"
      style={{ backgroundImage: imageData ? `url(${imageData})` : "none" }}
    >
      <div className="news-card-overlay">
        <div className="news-card-content">
          <h5 className="news-card-area">{area}</h5>
          <h2 className="news-card-title">{title}</h2>
        </div>
        <button className="news-card-button" onClick={onClick}>
          Ver noticia
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
