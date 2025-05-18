// components/DatePicker.jsx
"use client";

import { useState, forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}) {
  // Composant d'input personnalisé qui utilise Button de shadcn/ui
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      onClick={onClick}
      className={cn(
        "w-full justify-between text-left font-normal",
        !value && "text-muted-foreground",
        className
      )}
    >
      {value || placeholder}
      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
    </Button>
  ));

  CustomInput.displayName = "DatePickerButton";

  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      locale={fr}
      dateFormat="dd/MM/yyyy"
      customInput={<CustomInput />}
      showPopperArrow={false}
      popperClassName="react-datepicker-popper"
    />
  );
}
