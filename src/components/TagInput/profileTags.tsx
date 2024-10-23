import { BoxCheck } from "./BoxCheck";
import { Button } from "./Button";
import { CloseIcon } from "./CloseIcon";
import { CardWithBorder } from "./CardWithBorder";

import { type FC } from "react";
import { type ProfileTagsProps } from "./ProfileTagsProps";
import { useProfileTags } from "@/hooks/useProfileTags";

export const ProfileTags: FC<ProfileTagsProps> = ({
  tags,
  isCloseIcon = false,
  isSelector = false,
  isContainerTags = true,
  color = "Black",
  onChangeTags = () => {},
  className,
  children,
  ...rest
}) => {
  const { handleRemoveTag, handleChange, nameTagLimitedCharacters } =
    useProfileTags(tags, onChangeTags);

  const content = () => {
    return tags.map((tag) => (
      <Button
        size="small"
        style={
          color === "Black"
            ? "primary"
            : color === "White"
            ? "secondary"
            : "primary"
        }
        type="label"
        key={tag.id}
        typeColor={
          color === "Black"
            ? "primary"
            : color === "White"
            ? "lihgt"
            : "primary"
        }
        className="p-2"
        typeSubmit="button"
        //onClick={() => {}}
      >
        <div
          className={
            isSelector || isCloseIcon
              ? "flex items-center justify-center "
              : "flex items-center justify-center"
          }
        >
          <p
            className="text-ui-body-small-label pr-2
          "
          >
            {nameTagLimitedCharacters(tag.tagName)}
          </p>
          {isCloseIcon ? (
            <div
              onClick={(e) => {
                e.preventDefault();
                handleRemoveTag(tag.id);
              }}
            >
              <CloseIcon
                className={
                  color === "White" ? "text-ui-dark-3" : "text-ui-light-4"
                }
              ></CloseIcon>
            </div>
          ) : isSelector ? (
            <BoxCheck
              required={false}
              status="labeled"
              check={true}
              onCheckChange={(checked: any) => {
                handleChange(checked, tag);
              }}
            ></BoxCheck>
          ) : null}
        </div>
      </Button>
    ));
  };
  return isContainerTags ? (
    <div>
      <CardWithBorder
        className={`flex flex-wrap gap-2 p-16 ${className} `}
        {...rest}
      >
        {content()}
      </CardWithBorder>
    </div>
  ) : (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {content()}
      {children}
    </div>
  );
};
