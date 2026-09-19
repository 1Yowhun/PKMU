"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { id } from "date-fns/locale";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: Date | null | string) => void;
  placeholder?: string;
  value?: Date | null;
  className?: string;
  name?: string;
}

export function DatePick({
  className,
  placeholder = "Pilih tanggal",
  onDateChange,
  value,
  name,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<any>(value ?? null);

  useEffect(() => {
    if (value === null) {
      setDate(null);
    }
  }, [value]);

  const handleDateChange = (newDate: any) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
      <Popover
        modal={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("justify-start text-left font-normal", className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "dd MMMM yyyy", { locale: id })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="absolute z-50 mt-2 w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            defaultMonth={date || undefined}
            disabled={(date) =>
              date > new Date() || date < new Date("2000-01-01")
            }
            initialFocus
            locale={id}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
