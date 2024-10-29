import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  options: { label: string; value: string }[];
  placeholder: string;
  width?: string;
  onChange: (value: string) => void;
}

const SelectComponent: React.FC<SelectProps> = ({
  options,
  placeholder,
  width = "180px",
  onChange,
}) => (
  <Select onValueChange={onChange}>
    <SelectTrigger
      className={`w-${
        width === "full" ? "full" : width === "min" ? "min" : `[${width}]`
      }`}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default SelectComponent;
