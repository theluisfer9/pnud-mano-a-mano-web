import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export type DateFormat =
  | "MM/dd/yyyy"
  | "dd/MM/yyyy"
  | "yyyy-MM-dd"
  | "dd.MM.yyyy"
  | string;

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  format?: DateFormat;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
}

export function DatePicker({
  date,
  setDate,
  format: dateFormat = "dd/MM/yyyy",
  placeholder = "Seleccionar fecha",
  className,
  label,
  disabled = false,
  error,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  // Update input value when date prop changes externally or via calendar
  React.useEffect(() => {
    if (date && isValid(date)) {
      // Check if date is valid
      try {
        setInputValue(format(date, dateFormat));
      } catch (e) {
        // Handle potential format error if dateFormat is invalid
        console.error("Error formatting date:", e);
        setInputValue("");
      }
    } else {
      setInputValue("");
    }
  }, [date, dateFormat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // --- Formatting Logic ---
    const separator = dateFormat.match(/[^a-zA-Z0-9]/)?.[0] || "/";
    const digitsOnly = rawValue.replace(/\D/g, "");
    const formatParts = dateFormat.split(separator).filter(Boolean); // Use the actual separator
    const formatPattern = formatParts.map((part) => part.length);
    const maxDigits = formatPattern.reduce((a, b) => a + b, 0);

    // Limit input digits to the maximum allowed by the format
    const limitedDigits = digitsOnly.substring(0, maxDigits);

    let formattedValue = "";
    let digitIndex = 0;

    // Build the formatted string based on limited digits and format pattern
    for (let i = 0; i < formatPattern.length; i++) {
      const partLength = formatPattern[i];
      const part = limitedDigits.substring(digitIndex, digitIndex + partLength);

      if (part) {
        formattedValue += part;
        digitIndex += part.length;
        // Add separator if not the last part AND there are more digits left to process
        if (i < formatPattern.length - 1 && digitIndex < limitedDigits.length) {
          formattedValue += separator;
        }
      } else {
        // No more digits left for this part or subsequent parts
        break;
      }
    }
    // --- End Formatting Logic ---

    setInputValue(formattedValue); // Update the visible input value

    // --- Cursor Position Calculation ---
    // Calculate where the cursor should be *after* the last typed digit
    let cursorPos = 0;
    let digitsCounted = 0;
    for (const char of formattedValue) {
      cursorPos++;
      // Check if the character is a digit (more robust than relying on regex)
      if (char >= "0" && char <= "9") {
        digitsCounted++;
      }
      // Stop calculating position once we've accounted for all the digits entered
      if (digitsCounted === limitedDigits.length) {
        break;
      }
    }
    // --- End Cursor Position Calculation ---

    // --- Date Parsing and State Update ---
    // Only try to parse and set the date if the number of digits matches the total required
    const isPotentiallyComplete = limitedDigits.length === maxDigits;
    let parsedDate: Date | undefined = undefined;

    if (isPotentiallyComplete) {
      try {
        const attemptParse = parse(formattedValue, dateFormat, new Date());
        if (isValid(attemptParse)) {
          parsedDate = attemptParse;
        }
      } catch (parseError) {
        // Ignore parsing errors during typing if format is temporarily invalid
      }
    }
    // Update the external date state (only if different or cleared)
    // Check dates by time value for accurate comparison
    if (parsedDate?.getTime() !== date?.getTime()) {
      setDate(parsedDate);
    } else if (!parsedDate && date) {
      setDate(undefined); // Clear if input becomes incomplete/invalid
    }
    // --- End Date Parsing ---

    // --- Set Cursor Position ---
    // Use requestAnimationFrame to ensure the input value has been updated in the DOM
    requestAnimationFrame(() => {
      // Check if the target still exists (might be unmounted)
      if (e.target) {
        e.target.setSelectionRange(cursorPos, cursorPos);
      }
    });
    // --- End Set Cursor Position ---
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate); // Update external state first
    setOpen(false);
    // The useEffect listening to `date` will handle updating `inputValue`
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor="date-input">{label}</Label>}
      <div className="flex">
        <Input
          id="date-input" // Ensure this ID exists if used elsewhere
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder} // Use the dynamic placeholder based on format
          className={cn(
            "rounded-r-none",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={disabled}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"} // Ensure variant is correct
              type="button" // Prevent form submission if inside a form
              className={cn(
                "rounded-l-none border-l-0",
                !inputValue && "text-muted-foreground", // Style placeholder state if needed
                error && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={disabled}
              aria-label="Open calendar" // Accessibility
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              disabled={disabled} // Pass disabled state to Calendar
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
