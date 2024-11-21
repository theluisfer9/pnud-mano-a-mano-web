import React from "react";
import {
  StackedCarousel,
  ResponsiveContainer,
} from "react-stacked-center-carousel";
import Fab from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRenderMobileOrDesktop } from "@/utils/functions";

interface Slide {
  src: string;
  alt: string;
}

export default function ResponsiveCarousel(props: { slides: Slide[] }) {
  const ref = React.useRef();
  const [centerSlideDataIndex, setCenterSlideDataIndex] = React.useState(0);
  const { isWindowPhone } = useRenderMobileOrDesktop();

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <ResponsiveContainer
        carouselRef={ref}
        render={(parentWidth, carouselRef) => {
          // Refined breakpoints and slide dimensions
          let currentVisibleSlide = 5;
          if (isWindowPhone) {
            currentVisibleSlide = 1;
          }

          return (
            <StackedCarousel
              ref={carouselRef}
              slideComponent={Card}
              slideWidth={parentWidth < 800 ? parentWidth - 40 : 750} // Adjusted max width
              carouselWidth={parentWidth}
              data={props.slides}
              currentVisibleSlide={currentVisibleSlide}
              maxVisibleSlide={5}
              useGrabCursor
              onActiveSlideChange={setCenterSlideDataIndex}
            />
          );
        }}
      />
      {!isWindowPhone && (
        <>
          <Fab
            style={{ position: "absolute", top: "40%", left: 10, zIndex: 10 }}
            size="small"
            color="default"
            onClick={() => {
              //@ts-ignore
              ref.current?.goBack();
            }}
          >
            <ArrowBackIcon />
          </Fab>
          <Fab
            style={{ position: "absolute", top: "40%", right: 10, zIndex: 10 }}
            size="small"
            color="default"
            onClick={() => {
              //@ts-ignore
              ref.current?.goNext(6);
            }}
          >
            <ArrowForwardIcon />
          </Fab>
        </>
      )}
      <Pagination
        centerSlideDataIndex={centerSlideDataIndex}
        slides={props.slides}
      />
    </div>
  );
}

// Very import to memoize your Slide component otherwise there might be performance issue
// At minimum your should do a simple React.memo(SlideComponent)
// If you want the absolute best performance then pass in a custom comparator function like below
export const Card = React.memo(function (props: {
  data: Slide[];
  dataIndex: number;
}) {
  const { data, dataIndex } = props;
  const cover = data[dataIndex].src;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        userSelect: "none",
      }}
      className="my-slide-component"
    >
      <img
        style={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          borderRadius: 15,
        }}
        draggable={false}
        src={cover}
      />
    </div>
  );
});

function Pagination(props: { centerSlideDataIndex: number; slides: Slide[] }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 15,
        position: "relative",
      }}
    >
      {props.slides.map((_, index) => {
        const isCenterSlide = props.centerSlideDataIndex === index;
        return (
          <div
            key={index}
            style={{
              height: 15,
              width: 15,
              borderRadius: "100%",
              background: isCenterSlide ? "black" : "none",
              border: "1px solid black",
            }}
          />
        );
      })}
    </div>
  );
}
