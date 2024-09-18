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
    <div className="news-card" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="news-card-overlay">
        <h5 className="news-card-area">{area}</h5>
        <h2 className="news-card-title">{title}</h2>
        <button className="news-card-button" onClick={onClick}>
          Ver noticia
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
