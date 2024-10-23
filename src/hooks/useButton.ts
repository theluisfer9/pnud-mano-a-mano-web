import { useEffect, useState } from "react";
export interface IButtonProps {
  type: "icon-only" | "icon-right" | "icon-left" | "label" | "both";
  size: "small" | "medium" | "large";
  style: "primary" | "secondary" | "ghost";
  typeColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "third"
    | "fourth"
    | "gray"
    | "dark2"
    | "lihgt"
    | "dark3";
  fullWidht?: boolean;
  icon?: React.ReactNode;
  iconSecondary?: React.ReactNode;
  children?: React.ReactNode;
  typeSubmit?: "button" | "submit" | "reset";
}
export interface PropsUseButtons extends IButtonProps {
  disabled?: boolean | undefined;
}
export const useButtons = ({
  type,
  size,
  style,
  typeColor = "primary",
  fullWidht,
  icon,
  children,
  disabled,
}: PropsUseButtons) => {
  const [currentColor, setCurrentColor] = useState(typeColor);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentStyle, setCurrentStyle] = useState(style);
  const [ColorActiveClass, setColorActiveClass] = useState(
    "active:bg-ui-dark-1 active:border active:border-bg-ui-dark-1"
  );
  const [ColorPrimaryFocusClass, setColorPrimaryFocusClass] = useState(
    "focus:border focus:bg-ui-dark-1"
  );
  const [ColorSecondaryHoverClass, setSecondaryHoverClass] = useState(
    "hover:bg-ui-dark-1  hover:text-ui-light-4"
  );
  const [ColorClass, setColorClass] = useState("bg-ui-dark-1");
  const [ColorBorderClass, setColorBorderClass] = useState("border-ui-dark-1");
  const [ColorTextClass, setColorTextClass] = useState("text-ui-dark-1");
  const [ColorGhostFocusClass, setColorGhostFocusClass] = useState(
    "focus:border focus:border-ui-dark-1 focus:text-ui-dark-1"
  );

  useEffect(() => {
    setCurrentColor(typeColor);
    setColorActiveClass(
      {
        primary: "active:bg-ui-dark-1 active:border active:border-ui-dark-1",
        secondary:
          "active:bg-ui-secondary active:border active:border-ui-secondary",
        error: "active:bg-ui-error active:border active:border-ui-error",
        warning: "active:bg-ui-warning active:border active:border-ui-warning",
        info: "active:bg-ui-info active:border active:border-ui-info",
        success: "active:bg-ui-success active:border active:border-ui-success",
        third: "active:bg-ui-third active:border active:border-ui-third",
        fourth: "active:bg-ui-fourth active:border active:border-ui-fourth",
        gray: "active:bg-ui-dark-3 active:border active:border-ui-dark-3",
        lihgt: "active:bg-ui-light-1 active:border active:border-ui-light-1",
        dark2: "active:bg-ui-dark-2 active:border active:border-ui-dark-2",
        dark3: "active:bg-ui-dark-3 active:border active:border-ui-dark-3",
      }[currentColor]
    );
    setColorPrimaryFocusClass(
      {
        primary: "focus:border focus:border-ui-dark-1",
        secondary: "focus:border focus:border-ui-secondary",
        error: "focus:border focus:border-ui-error",
        warning: "focus:border focus:border-ui-warning",
        info: "focus:border focus:border-ui-info",
        success: "focus:border focus:border-ui-success",
        third: "focus:border focus:border-ui-third",
        fourth: "focus:border focus:border-ui-fourth",
        gray: "focus:border focus:border-ui-dark-3",
        lihgt: "focus:border focus:border-ui-light-1",
        dark2: "focus:border focus:border-ui-dark-2",
        dark3: "focus:border focus:border-ui-dark-3",
      }[currentColor]
    );
    setSecondaryHoverClass(
      {
        primary: "hover:bg-ui-dark-1  hover:text-ui-light-4",
        secondary: "hover:bg-ui-secondary  hover:text-ui-light-4",
        error: "hover:bg-ui-error  hover:text-ui-light-4",
        warning: "hover:bg-ui-warning  hover:text-ui-light-4",
        info: "hover:bg-ui-info  hover:text-ui-light-4",
        success: "hover:bg-ui-success hover:text-ui-light-4",
        third: "hover:bg-ui-third hover:text-ui-light-4",
        fourth: "hover:bg-ui-fourth hover:text-ui-light-4",
        gray: "hover:bg-ui-dark-3 hover:text-ui-light-4",
        lihgt: "hover:bg-ui-light-1 hover:text-ui-light-4",
        dark2: "hover:bg-ui-dark-2 hover:text-ui-light-4",
        dark3: "hover:bg-ui-dark-3 hover:text-ui-light-4",
      }[currentColor]
    );
    setColorGhostFocusClass(
      {
        primary: "focus:border focus:border-ui-dark-1 focus:text-ui-dark-1",
        secondary:
          "focus:border focus:border-ui-secondary focus:text-ui-secondary",
        error: "focus:border focus:border-ui-error focus:text-ui-error",
        warning: "focus:border focus:border-ui-warning focus:text-ui-warning",
        info: "focus:border focus:border-ui-info focus:text-ui-info",
        success: "focus:border focus:border-ui-success focus:text-ui-success",
        third: "focus:border focus:border-ui-third focus:text-ui-third",
        fourth: "focus:border focus:border-ui-fourth focus:text-ui-fourth",
        gray: "focus:border focus:border-ui-dark-3 focus:text-ui-dark-3",
        lihgt: "focus:border focus:border-ui-light-1 focus:text-ui-dark-2",
        dark2: "focus:border focus:border-ui-dark-2 focus:text-ui-dark-2",
        dark3: "focus:border focus:border-ui-dark-3 focus:text-ui-dark-3",
      }[currentColor]
    );
    setColorClass(
      {
        primary: "bg-ui-dark-1",
        secondary: "bg-ui-secondary",
        error: "bg-ui-error",
        warning: "bg-ui-warning",
        info: "bg-ui-info",
        success: "bg-ui-success",
        third: "bg-ui-third",
        fourth: "bg-ui-fourth",
        gray: "bg-ui-dark-3",
        lihgt: "bg-ui-light-1",
        dark2: "bg-ui-dark-2",
        dark3: "bg-ui-dark-3",
      }[currentColor]
    );

    setColorBorderClass(
      {
        primary: "border-ui-dark-1 text-ui-dark-1",
        secondary: "border-ui-secondary",
        error: "border-ui-error",
        warning: "border-ui-warning",
        info: "border-ui-info",
        success: "border-ui-success",
        third: "border-ui-third",
        fourth: "border-ui-fourth",
        gray: "border-ui-dark-3 text-ui-dark-3",
        lihgt: "border-ui-light-1 text-ui-dark-2",
        dark2: "border-ui-dark-2 text-ui-dark-2",
        dark3: "border-ui-dark-3",
      }[currentColor]
    );

    setColorTextClass(
      {
        primary: "text-ui-dark-1",
        secondary: "text-ui-secondary",
        error: "text-ui-error",
        warning: "text-ui-warning",
        info: "text-ui-info",
        success: "text-ui-success",
        third: "text-ui-third",
        fourth: "text-ui-fourth",
        gray: "text-ui-dark-3",
        lihgt: "text-ui-dark-2",
        dark2: "text-ui-dark-2",
        dark3: "text-ui-dark-3",
      }[currentColor]
    );
    setCurrentSize(size);
    setCurrentStyle(style);
  }, [currentColor, size, style, typeColor]);

  const sizeClass = {
    small: "h-6 p-2 rounded text-ui-body-small-label",
    medium: "w-15 h-8 px-4 py-2 rounded-lg text-ui-body-small-label",
    large: "w-22 h-12 px-6 py-3 rounded-lg text-ui-body-normal",
  }[currentSize];

  const sizeClassIcon = {
    small: "w-6 h-6 p-2 rounded text-ui-body-small-label",
    medium: "w-8 h-8 p-3 py-2 rounded-lg text-ui-body-small-label",
    large: "w-12 h-12 p-4 rounded-lg leading-7 text-ui-body-normal",
  }[currentSize];

  const sizeClassIconLabel = {
    small: "h-7 p-2 rounded text-ui-body-small-label",
    medium: "h-8 px-4 py-2 rounded-lg text-xs",
    large: "h-12 px-6 rounded-lg  leading-7 text-ui-body-normal",
  }[currentSize];

  const focusPrimary = `focus:outline-none focus:bg-ui-dark-3 ${ColorPrimaryFocusClass} focus:text-ui-light-4 `;
  const activePrimary = `${ColorActiveClass} active:text-ui-light-4 `;
  const hoverPrimaryClass = `hover:bg-ui-light-2  hover:text-ui-dark-1 ${ColorClass} text-ui-light-4 `;
  const primaryClass =
    disabled !== undefined && disabled
      ? "opacity-40 bg-ui-dark-4  text-ui-dark-1 "
      : hoverPrimaryClass + focusPrimary + activePrimary;

  const focusSecondary =
    " focus:outline-none focus:bg-ui-dark-4 focus:border focus:border-ui-dark-2  focus:text-ui-dark-2";
  const activeSecondary =
    " active:bg-ui-dark-4 active:border active:border-ui-dark-1 active:text-ui-dark-1";
  const hoverSecondaryClass = `${ColorSecondaryHoverClass} border ${ColorBorderClass} hover:text-ui-light-4 `;
  const secondaryClass =
    disabled !== undefined && disabled
      ? "opacity-80 border border-ui-dark-4 text-ui-dark-4"
      : hoverSecondaryClass + focusSecondary + activeSecondary;

  const focusGhost = ` ${ColorGhostFocusClass}`;
  const activeGhost =
    " active:bg-ui-dark-4 active:border active:border-bg-ui-dark-4";
  const hoverGhostClass = `hover:bg-transparent  ${ColorTextClass}  hover:text-ui-dark-2`;
  const ghostClass =
    disabled !== undefined && disabled
      ? "opacity-80 text-ui-dark-4"
      : hoverGhostClass + focusGhost + activeGhost;

  const styleClass = {
    primary: primaryClass,
    secondary: secondaryClass,
    ghost: ghostClass,
  }[currentStyle];
  return {
    sizeClass,
    sizeClassIcon,
    sizeClassIconLabel,
    styleClass,
  };
};
