import { type FC } from "react";

export interface PropsSVGExtends
  extends React.HTMLAttributes<SVGSVGElement | HTMLSpanElement> {}

export const IconCheck: FC<PropsSVGExtends> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="16" height="16" rx="4" fill="#252525" />
      <path
        d="M5 9L6.85094 10.8509C6.93196 10.932 7.06437 10.9285 7.14102 10.8433L11.5 6"
        stroke="#FAFAFC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center", // Centrar horizontalmente
  alignItems: "center", // Centrar verticalmente
  width: "100%",
  height: "100%",
};

export const IconLeft: FC<PropsSVGExtends> = (props) => {
  return (
    <div style={containerStyle}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect width="16" height="16" rx="4" fill="#252525" />

        <path
          d="M4.33341 8H11.6667"
          stroke="#FAFAFC"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const IconNotCheck: FC<PropsSVGExtends> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.5"
        y="0.5"
        width="15"
        height="15"
        rx="3.5"
        fill="#F2F2F5"
        stroke="#C7C9D9"
      />
    </svg>
  );
};
