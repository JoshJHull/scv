import {Dispatch, SetStateAction, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";


export default function LocCombo({value, setValue, disabled}: {value: string, setValue: Dispatch<SetStateAction<string>>, disabled: boolean}) {
    const [open, setOpen] = useState(false);

    const locations = [
        {
            value: "microtech",
            label: "Microtech",
        },
        {
            value: "arccorp",
            label: "ArcCorp",
        },
        {
            value: "hurston",
            label: "Hurston",
        },
        {
            value: "crusader",
            label: "Crusader",
        },
    ]

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? locations.find((route) => route.value === value)?.label
                        : "Select location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search locations..." />
                    <CommandList>
                        <CommandEmpty>No locations found.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((route) => (
                                <CommandItem
                                    key={route.value}
                                    value={route.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === route.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {route.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}