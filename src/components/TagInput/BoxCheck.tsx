import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { IconCheck, IconLeft, IconNotCheck } from "./iconCheck";

interface BoxCheckProps {
  status: "labeled" | "active" | "disabled";
  required: boolean;
  checkedValue?: boolean;
  check?: boolean;
  Checked?: any;
  onCheckChange?: (checked: boolean, item?: any) => void; // Status of check, active, disabled, labeled or any combination of them
  customLabel?: string;
  disabled?: boolean;
  notPadding?: boolean;
  notPaddingLeft?: boolean;
}

export const BoxCheck: React.FC<BoxCheckProps> = ({
  status,
  required,
  checkedValue,
  onCheckChange,
  customLabel = "",
  disabled = false,
  notPadding = false,
  notPaddingLeft = false,
}) => {
  const [checked, setChecked] = React.useState([true, false]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckChange != null) {
      onCheckChange(event.target.checked);
    }
  };

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  if (status.includes("labeled")) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          required={required}
          checkedIcon={
            // this is a conditional rendering of the check icon
            checkedValue === true || checkedValue === undefined ? (
              <IconCheck />
            ) : (
              <IconNotCheck />
            )
          }
          icon={<IconNotCheck />} // this is the icon when the checkbox is not checked
          checked={checkedValue}
          onChange={handleChange}
          disabled={disabled}
          sx={notPadding ? { p: 0 } : notPaddingLeft ? { pl: 0 } : {}}
        />
        {customLabel !== "" && (
          <label className="text-ui-14px-link text-ui-dark-2">
            {customLabel}
          </label>
        )}
      </div>
    );
  } else if (status.includes("disabled")) {
    return (
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <FormControlLabel
            label=""
            control={
              <Checkbox
                required={required}
                checkedIcon={<IconCheck />}
                icon={<IconNotCheck />}
                disabled
              />
            }
          />
          <FormControlLabel
            label=""
            control={
              <Checkbox
                required={required}
                checkedIcon={<IconCheck />}
                icon={<IconNotCheck />}
                disabled
              />
            }
          />
        </Box>
        <FormControlLabel
          label="Parent"
          control={
            <Checkbox
              required={required}
              checkedIcon={<IconCheck />}
              indeterminateIcon={<IconLeft />}
              icon={<IconCheck />}
              checked={checked[0] && checked[1]}
              indeterminate={checked[0] !== checked[1]}
              onChange={handleChange1}
              disabled
            />
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <FormControlLabel
          label=""
          control={
            <Checkbox
              checkedIcon={<IconCheck />}
              icon={<IconNotCheck />}
              checked={checked[0]}
              onChange={handleChange2}
            />
          }
        />
        <FormControlLabel
          label=""
          control={
            <Checkbox
              checkedIcon={<IconCheck />}
              icon={<IconNotCheck />}
              checked={checked[1]}
              onChange={handleChange3}
            />
          }
        />
      </Box>
      <FormControlLabel
        label="Parent"
        control={
          <Checkbox
            checkedIcon={<IconCheck />}
            indeterminateIcon={<IconLeft />}
            icon={<IconNotCheck />}
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
    </div>
  );
};
