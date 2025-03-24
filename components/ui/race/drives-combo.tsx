import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Dispatch, SetStateAction, useState} from "react";


export default function DrivesCombo({value, setValue, disabled}: {value: string, setValue: Dispatch<SetStateAction<string>>, disabled: boolean}) {
    const [open, setOpen] = useState(false);

    const drives = [
        {
            value: "sparkfire",
            label: "Sparkfire",
        },
        {
            value: "torrent",
            label: "Torrent",
        },
    ]

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
                        ? drives.find((drive) => drive.value === value)?.label
                        : "Select drive..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search drives..." />
                    <CommandList>
                        <CommandEmpty>No ships found.</CommandEmpty>
                        <CommandGroup>
                            {drives.map((drive) => (
                                <CommandItem
                                    key={drive.value}
                                    value={drive.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === drive.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {drive.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}