import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type FC,
  type ReactNode,
} from "react";

export interface CardWhithBorderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
  colorBorder?:
    | "border-ui-light-1"
    | "border-ui-secondary-lighter"
    | "border-ui-dark-2"
    | "border-ui-dark-4"
    | "border-ui-dark-3"
    | "border-ui-light-2";
  colorBackground?: string;
}

export const CardWithBorder: FC<CardWhithBorderProps> = ({
  children,
  colorBorder = "border-ui-light-1",
  colorBackground = "bg-ui-light-4",
  className,
  ...props
}) => {
  return (
    <div
      className={`${colorBackground} rounded-lg border ${colorBorder} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
