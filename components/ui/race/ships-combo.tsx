import {Dispatch, SetStateAction, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";


export default function ShipsCombo({value, setValue}: {value: string, setValue: Dispatch<SetStateAction<string>>}) {
    const [open, setOpen] = useState(false);

    const ships = [
        {
            value: "misc_starlancer_max",
            label: "MISC Starlancer MAX",
        },
        {
            value: "rsi_apollo",
            label: "RSI Apollo",
        },
    ]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? ships.find((ship) => ship.value === value)?.label
                        : "Select ship..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search ships..." />
                    <CommandList>
                        <CommandEmpty>No ships found.</CommandEmpty>
                        <CommandGroup>
                            {ships.map((ship) => (
                                <CommandItem
                                    key={ship.value}
                                    value={ship.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === ship.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {ship.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}