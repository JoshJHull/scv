import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Ship} from "@/lib/definitions";


export default function ShipsCombo({value, onChange, shipList, disabled}:
    {value: string, onChange: (currentValue: string) => void, shipList: Array<Ship>, disabled: boolean}) {

    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? shipList.find((ship) => ship.id === value)?.name
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
                            {shipList.map((ship) => (
                                <CommandItem
                                    key={ship.id}
                                    value={ship.id}
                                    onSelect={(currentValue) => {
                                        if(currentValue != value)
                                            onChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === ship.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {ship.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}