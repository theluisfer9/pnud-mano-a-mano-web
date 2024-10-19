import React from "react";
import "./home-map.css";
import GuatemalaMapAsset from "@/assets/guatemala-departments.svg";
interface GuatemalaMapProps {
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}

const GuatemalaMap: React.FC<GuatemalaMapProps> = ({ onClick }) => {
  return (
    <div className="home-map-container">
      <svg onClick={onClick} className="home-map">
        <GuatemalaMapAsset />
      </svg>
    </div>
  );
};

export default GuatemalaMap;
