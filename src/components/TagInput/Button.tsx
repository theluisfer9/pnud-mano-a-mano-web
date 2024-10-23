import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type FC,
} from "react";
import { useButtons } from "@/hooks/useButton";
import { type IButtonProps } from "@/hooks/useButton";

export interface PropsSVGExtends
  extends React.HTMLAttributes<SVGSVGElement | HTMLSpanElement> {}

export const AddIcon: FC<PropsSVGExtends> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6 12h12M12 18V6"
      ></path>
    </svg>
  );
};

export const Button: FC<
  IButtonProps &
    Omit<
      DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "type" | "style"
    >
> = ({
  type,
  size,
  style,
  typeColor = "primary",
  fullWidht,
  icon = <AddIcon></AddIcon>,
  iconSecondary = <AddIcon></AddIcon>,
  children,
  typeSubmit,
  className,
  ...props
}) => {
  const { disabled } = props;

  const { sizeClass, sizeClassIcon, sizeClassIconLabel, styleClass } =
    useButtons({
      type,
      size,
      style,
      typeColor,
      fullWidht,
      icon,
      children,
      disabled,
    });

  return (
    <button
      disabled={disabled}
      {...props}
      className={`${
        type === "icon-only"
          ? `${sizeClassIcon}`
          : type === "label"
          ? `${sizeClass}`
          : `${sizeClassIconLabel}`
      }  ${styleClass} justify-center items-center   text-center  inline-flex ${
        fullWidht !== undefined && Boolean(fullWidht) ? "w-full" : ""
      } ${className}`}
      type={typeSubmit}
    >
      {type === "icon-only" ? (
        <div className="relative">{icon}</div>
      ) : type === "icon-right" ? (
        <div className="flex items-center w-full  justify-center m-8 space-x-7">
          <div>{children}</div>
          <div className=" flex items-center justify-center">
            <div className="text-ui-body-small-label">{icon}</div>
          </div>
        </div>
      ) : type === "icon-left" ? (
        <div className="flex flex-row items-center w-full justify-center space-x-7">
          <div className=" flex items-center justify-center  space-x-7">
            <div className="text-ui-body-small-label">{icon}</div>
          </div>
          <div>{children}</div>
        </div>
      ) : type === "both" ? (
        <div className="flex flex-row items-center w-full justify-center gap-2">
          <div className="text-ui-body-small-label">{icon}</div>
          <div>{children}</div>
          <div className="text-ui-body-small-label">{iconSecondary}</div>
        </div>
      ) : (
        <div className=" gap-2.5 ">{children}</div>
      )}
    </button>
  );
};
