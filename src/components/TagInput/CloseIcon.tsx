import { FC } from "react";

export interface PropsSVGExtends
  extends React.HTMLAttributes<SVGSVGElement | HTMLSpanElement> {}

export const CloseIcon: FC<PropsSVGExtends> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      {...props}
    >
      <path
        d="M1.16992 6.83004L6.82992 1.17004"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.82992 6.83004L1.16992 1.17004"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
