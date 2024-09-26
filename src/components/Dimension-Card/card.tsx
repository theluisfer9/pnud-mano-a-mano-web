import { useLayoutEffect, useRef, useState } from "react";
import "./card.css";

interface DimensionCardProps {
  id: string;
  name: string;
  image: string;
  details: string[];
}

const DimensionCard: React.FC<DimensionCardProps> = ({ id, name, image, details }) => {
  const [detailsHeight, setDetailsHeight] = useState(0);
  const detailsRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (detailsRef.current) {
      setDetailsHeight(detailsRef.current.scrollHeight);
    }
  }, [details]);
  return (
    <div
      className="card"
      style={{
        "--details-height": `${detailsHeight}px`,
        background: `linear-gradient(0deg, rgba(84, 89, 93, 0.75) 0%, rgba(217, 217, 217, 0.00) 100%), url(${image}) lightgray 50% / cover no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } as React.CSSProperties}
    >
      <div className="card-content">
        <p className="card-number">{id}</p>
        <h3 className="card-title">{name}</h3>
        <section className="card-details" ref={detailsRef}>
          <hr />
          <ul>
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DimensionCard;
