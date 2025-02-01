import {Dispatch, SetStateAction, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";


export default function RouteCombo({value, setValue}: {value: string, setValue: Dispatch<SetStateAction<string>>}) {
    const [open, setOpen] = useState(false);

    const routes = [
        {
            value: "microtech,hurston",
            label: "Microtech -> Hurston",
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
                        ? routes.find((route) => route.value === value)?.label
                        : "Select route..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search routes..." />
                    <CommandList>
                        <CommandEmpty>No routes found.</CommandEmpty>
                        <CommandGroup>
                            {routes.map((route) => (
                                <CommandItem
                                    key={route.value}
                                    value={route.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
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