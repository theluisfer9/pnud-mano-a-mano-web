import React from "react";
import "./relatedNewsCard.css";

interface BasicNewsCardProps {
  area: string;
  date: string;
  title: string;
  onClick: () => void;
}

const RelatedNewsCard: React.FC<BasicNewsCardProps> = ({
  area,
  date,
  title,
  onClick,
}) => {
  return (
    <div className="basic-news-card" onClick={onClick}>
      <div className="basic-news-card-content">
        <p className="basic-news-card-area">{area}</p>
        <p className="basic-news-card-date">
          {new Date(date).toLocaleDateString("es-Gt")}
        </p>
        <h3 className="basic-news-card-title">{title}</h3>
        <p className="basic-news-card-link">Ver más</p>
      </div>
    </div>
  );
};

export default RelatedNewsCard;
