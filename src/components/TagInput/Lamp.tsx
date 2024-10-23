import { type FC } from "react";

export interface PropsSVGExtends
  extends React.HTMLAttributes<SVGSVGElement | HTMLSpanElement> {}

export const Lamp: FC<PropsSVGExtends> = (props) => {
  return (
    <div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g id="vuesax/linear/lamp-on">
          <g id="lamp-on">
            <path
              id="Vector"
              d="M5.53357 12.0266V11.2533C4.00023 10.3266 2.74023 8.51995 2.74023 6.59995C2.74023 3.29995 5.77357 0.713288 9.20023 1.45995C10.7069 1.79329 12.0269 2.79329 12.7136 4.17329C14.1069 6.97329 12.6402 9.94662 10.4869 11.2466V12.02C10.4869 12.2133 10.5602 12.66 9.8469 12.66H6.17357C5.44023 12.6666 5.53357 12.38 5.53357 12.0266Z"
              stroke="#FAFAFC"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M5.6665 14.6666C7.19317 14.2332 8.8065 14.2332 10.3332 14.6666"
              stroke="#FAFAFC"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
