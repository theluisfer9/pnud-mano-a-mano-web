import React from "react";
import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";
import { Lamp } from "./Lamp";
import { DEVELOP_BOX_COLOR } from "@/utils/constants";

interface ToltipsListProps {
  customText?: string;
  icon?: React.ReactNode;
}
interface ToltipsProps {
  customText?: React.ReactNode;
  status?:
    | "top"
    | "top-end"
    | "top-start"
    | "bottom"
    | "bottom-end"
    | "bottom-start"
    | undefined
    | "left"
    | "left-end"
    | "left-start"
    | "right"
    | "right-end"
    | "right-start";
  type?: "none" | "icon-right" | "icon-left";
  icon?: React.ReactNode;
  children: React.ReactNode;
  toltipProps?: Omit<TooltipProps, "title" | "children">;
  minWidht?: string;
  list?: ToltipsListProps[];
  className?: string;
  alignIcon?: "center" | "start" | "end";
  backgroundColorTooltip?: string;
  borderColorTooltip?: string;
}

export const Tooltips: React.FC<ToltipsProps> = ({
  customText,
  status = undefined,
  type = "none",
  icon = <Lamp></Lamp>,
  children,
  minWidht = "6rem",
  className = "inline-block w-full",
  alignIcon = "center",
  list,
  backgroundColorTooltip = DEVELOP_BOX_COLOR.dark.dark1,
  borderColorTooltip = DEVELOP_BOX_COLOR.dark.dark1,
}) => {
  return (
    <Tooltip
      title={
        type === "icon-right" ? (
          list !== undefined ? (
            <div>
              {list.map((item, index) => (
                <div key={index} className="pb-8">
                  <div className="flex w-full  justify-start items-center  space-x-8">
                    <div>{item.customText}</div>
                    <div>
                      <div>{item.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`flex w-full justify-center items-${alignIcon} space-x-8`}
            >
              <div>{customText}</div>
              <div>
                <div>{icon}</div>
              </div>
            </div>
          )
        ) : type === "icon-left" ? (
          list !== undefined ? (
            <div>
              {list.map((item, index) => (
                <div key={index} className="pb-8">
                  <div className="flex w-full  justify-start items-center  space-x-8">
                    <div>
                      <div>{item.icon}</div>
                    </div>
                    <div>{item.customText}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`flex w-full justify-center items-${alignIcon} space-x-8`}
            >
              <div>
                <div>{icon}</div>
              </div>
              <div>{customText}</div>
            </div>
          )
        ) : list !== undefined ? (
          <div>
            {list.map((item, index) => (
              <div key={index} className="">
                <div className="flex w-full  justify-start items-center  space-x-8">
                  <div>{item.customText}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>{customText}</div>
        )
      }
      arrow
      placement={status}
      componentsProps={{
        tooltip: {
          sx: {
            minWidth: minWidht,
            minHeight: "2rem",
            maxWidth: "200px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            paddingTop: "8px",
            border: "1px solid",
            borderColor: borderColorTooltip,
            backgroundColor: backgroundColorTooltip,
            borderRadius: "8px",
            color: DEVELOP_BOX_COLOR.light.light4,
            fontSize: "10px",
            lineHeight: "17px",
          },
        },
        arrow: {
          sx: {
            color: backgroundColorTooltip,
          },
        },
      }}
    >
      <div className={className}>{children}</div>
    </Tooltip>
  );
};
