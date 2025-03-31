import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Dispatch, SetStateAction, useState} from "react";
import {Drive} from "@/lib/definitions";


export default function DrivesCombo({value, setValue, driveList, disabled}:
    {value: string, setValue: Dispatch<SetStateAction<string>>, driveList: Drive[], disabled: boolean}) {
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
                        ? driveList.find((drive) => drive.id === value)?.name
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
                            {driveList.map((drive) => (
                                <CommandItem
                                    key={drive.id}
                                    value={drive.id}
                                    onSelect={(currentValue) => {
                                        if(currentValue != value)
                                            setValue(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === drive.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {drive.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}