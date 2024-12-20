import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboBoxProps {
    data: { label: any; value: any }[];
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
    sortAsc?: boolean; 
}

const ComboBox: React.FC<ComboBoxProps> = ({
    data,
    value,
    setValue,
    placeholder = "Select data...",
    sortAsc = true, 
    }) => {
    const [open, setOpen] = useState(false);

    // Sort data based on the 'label' in ascending or descending order
    const sortedData = sortAsc
        ? [...data].sort((a, b) => a.label.localeCompare(b.label)) // Ascending
        : [...data].sort((a, b) => b.label.localeCompare(a.label)); // Descending

    return (
        <div className="my-2">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full sm:w-[300] justify-between truncate"
            >
                {value ? data.find((d) => d.value === value)?.label : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full sm:w-96">
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                <CommandEmpty>Data tidak ditemukan</CommandEmpty>
                <CommandGroup>
                    {sortedData.map((item) => (
                    <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === item.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {item.label}
                    </CommandItem>
                    ))}
                </CommandGroup>
                </CommandList>
            </Command>
            </PopoverContent>
        </Popover>
        </div>
    );
};

export default ComboBox;