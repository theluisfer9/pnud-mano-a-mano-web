import { ITag } from "@/hooks/useTagInput";
import { CardWhithBorderProps } from "./CardWithBorder";
import { ReactNode } from "react";

export interface ProfileTagsProps
  extends Omit<CardWhithBorderProps, "children"> {
  tags: ITag[];
  isCloseIcon?: boolean;
  isSelector?: boolean;
  isContainerTags?: boolean;
  color?: "Black" | "White";
  onChangeTags?: (tags: ITag[]) => void;
  disabled?: boolean;
  children?: ReactNode;
}
