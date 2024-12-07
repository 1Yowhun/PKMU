"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { id } from "date-fns/locale";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange?: (dateRange: any) => void;
    placeholder?: string;
    value?: any; 
}

export function DatePickerWithRange({
    className,
    placeholder = "Pilih tanggal",
    onDateChange,
    value,
}: DatePickerWithRangeProps) {
    const [date, setDate] = useState<any>(value ?? null); 

    useEffect(() => {
        if (value === null) {
            setDate(null); 
        }
    }, [value]);

    const handleDateChange = (newDate: any) => {
        setDate(newDate);
        console.log(onDateChange)
        if (onDateChange) {
            onDateChange(newDate); 
        }
    };

    return (
        <div className={cn("grid gap-2", className="my-2")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-[300] justify-start text-left font-normal"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd MMM yyyy", { locale: id })} - {format(date.to, "dd MMM yyyy", { locale: id })}
                                </>
                            ) : (
                                format(date.from, "dd MMM yyyy", { locale: id })
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                        }
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                        locale={id}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}