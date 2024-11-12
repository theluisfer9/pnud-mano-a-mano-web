import React from "react";
import "./newscard.css";

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
  return (
    <div
      className="news-card w-full"
      style={{ backgroundImage: `url(${imageUrl})` }}
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
