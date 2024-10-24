import { type FC } from "react";
import { useTagInput } from "@/hooks/useTagInput";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { ProfileTags } from "./profileTags";
import { type ITag } from "@/hooks/useTagInput";
import { InfoCircleIcon } from "./InfoCircleIcon";
import { Tooltips } from "./Tooltips";
import { FormHelperText } from "@mui/material";

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
  tags: ITag[];
  onChangeTags: (tags: ITag[]) => void;
  variant?: "outlined" | "filled";
  customLabel?: string;
  error?: boolean;
  disabled?: boolean;
  showInput?: boolean;
  textTooltip?: string;
  showEdit?: boolean;
  helperText?: string | undefined;
  borderColor?: "light" | "dark";
  noGap?: boolean;
}

export const TagInput: FC<Props & Omit<TextFieldProps, "type" | "style">> = ({
  noGap = false,
  customLabel,
  value,
  onChangeValue,
  tags,
  onChangeTags,
  variant = "outlined",
  error,
  disabled,
  textTooltip,
  showEdit = false,
  helperText,
  borderColor = "light",
  showInput = true,
  sx,
  ...props
}) => {
  const {
    focus,
    setFocus,
    handleFieldChange,
    editDisabled,
    handleEditDisabled,
    handleEnter,
  } = useTagInput(tags, onChangeTags, onChangeValue);
  return (
    <div className={`w-full flex flex-col ${!noGap ? "gap-2" : ""}`}>
      <div
        className={`w-full flex flex-row justify-end text-12px-link  ${
          error === true ? "text-ui-error" : "text-ui-dark-3"
        }`}
      >
        {customLabel != null && (
          <label
            className={`block ml-4 ${noGap ? "mb-2" : ""} ${
              borderColor === "dark" ? "text-ui-dark-2 text-ui-body-small" : ""
            }`}
          >
            {customLabel}
          </label>
        )}
        {showEdit ? (
          <div
            className="underline justify-self-end cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (disabled === true) return;
              handleEditDisabled();
            }}
          >
            {editDisabled ? "Guardar" : "Editar"}
          </div>
        ) : textTooltip != null ? (
          <div>
            <Tooltips customText={textTooltip} className="w-full">
              <InfoCircleIcon />
            </Tooltips>
          </div>
        ) : null}
      </div>
      <div
        className={`border ${
          error === true
            ? "border-ui-error"
            : disabled === true
            ? "border-ui-light-2"
            : focus
            ? "border-ui-dark-1"
            : borderColor === "dark"
            ? "border-ui-dark-2"
            : "border-ui-light-1"
        } p-4 rounded-lg 
          ${disabled === true ? "bg-ui-light-2" : ""}
        `}
      >
        <div
          className={`flex flex-wrap w-full ${tags.length > 0 ? "gap-2" : ""}`}
        >
          <ProfileTags
            tags={tags}
            onChangeTags={onChangeTags}
            isCloseIcon={showEdit ? editDisabled : true}
            isContainerTags={false}
            isSelector={false}
            color={variant === "outlined" ? "White" : "Black"}
            className="items-center w-full"
          >
            {showInput ? (
              <TextField
                {...props}
                value={value}
                onChange={(e) => {
                  handleFieldChange(e.target.value);
                }}
                onFocus={() => {
                  setFocus(true);
                }}
                onKeyDown={(e) => {
                  handleEnter(e);
                }}
                onBlur={() => {
                  setFocus(false);
                }}
                disabled={disabled}
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: "20%",
                  minWidth: "20%",
                  maxWidth: "100%",
                  border: "none",
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    padding: "4px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },

                  "& .MuiOutlinedInput-root": {
                    // Remove the border in the normal state
                    border: "none",
                    borderColor: "transparent",

                    // Remove the border in the hover state
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                      borderColor: "transparent",
                    },

                    // Remove the border in the focused state
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                      borderColor: "transparent",
                    },

                    // Remove the border in the disabled state
                    "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                  ...sx,
                }}
              />
            ) : (
              <div className="h-[14px]"></div>
            )}
          </ProfileTags>
        </div>
      </div>
      {helperText != null && (
        <FormHelperText className="pl-ui-16 text-ui-error">
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};
