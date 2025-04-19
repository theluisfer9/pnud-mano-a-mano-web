import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Option = {
  value: string;
  label: string;
};

interface AutocompleteProps {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  createOptionLabel?: string;
  onCreateOption?: (value: string) => void;
  className?: string;
}

export function AutocompleteInput({
  options: initialOptions,
  placeholder = "Selecciona una opción...",
  emptyMessage = "No se encontraron opciones.",
  value,
  onChange,
  createOptionLabel = "Crear",
  onCreateOption,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>(initialOptions);
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value);

  // Update internal state when external value changes
  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Filter options based on input value
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;

    const lowerCaseInput = inputValue.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(lowerCaseInput));
  }, [options, inputValue]);

  // Check if current input matches any existing option
  const exactOptionMatch = React.useMemo(() => {
    return options.some((option) => option.label.toLowerCase() === inputValue.toLowerCase());
  }, [options, inputValue]);

  // Handle selection of an option
  const handleSelect = (selectedValue: string) => {
    setSelectedValue(selectedValue);
    setOpen(false);
    onChange?.(selectedValue);
  };

  // Handle creation of a new option
  const handleCreateOption = () => {
    if (!inputValue.trim()) return;

    const newOption = {
      value: inputValue.trim(),
      label: inputValue.trim(),
    };

    setOptions((prev) => [...prev, newOption]);
    setSelectedValue(newOption.value);
    setInputValue("");
    setOpen(false);

    onChange?.(newOption.value);
    onCreateOption?.(newOption.value);
  };

  // Get the display value for the selected option
  const displayValue = React.useMemo(() => {
    if (!selectedValue) return "";
    return options.find((option) => option.value === selectedValue)?.label || "";
  }, [selectedValue, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedValue ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar opciones..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>

            {inputValue && !exactOptionMatch && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => handleCreateOption()} className="text-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    {createOptionLabel} "{inputValue}"
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
