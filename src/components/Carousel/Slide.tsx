import React from "react";
import { StackedCarouselSlideProps } from "react-stacked-center-carousel";
import "./slide.css";

export const Slide = React.memo(function ({
  data,
  dataIndex,
  isCenterSlide,
  swipeTo,
  slideIndex,
}: StackedCarouselSlideProps) {
  const coverImage = data[dataIndex].image;
  const text = data[dataIndex].text;

  console.log(coverImage);
  return (
    <div className="card-card" draggable={false}>
      <div className={`cover fill ${isCenterSlide ? "off" : "on"}`}>
        <div
          className="card-overlay fill"
          onClick={() => {
            if (!isCenterSlide) swipeTo(slideIndex);
          }}
        />
      </div>
      <div className="detail fill">
        <div className="discription">
          <img
            style={{ width: 100 }}
            alt="j"
            className="cover-image"
            src={coverImage}
          />
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
});
