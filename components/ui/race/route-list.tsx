"use client"

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useState} from "react";
import {RouteItem} from "@/components/ui/race/route-list-item";

export default function RouteList() {
    const [route, setRoute] = useState(["hurston", "microtech", "arccorp"]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    return (
        <div
            className={"bg-[#212529] text-white"}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={route}
                    strategy={verticalListSortingStrategy}
                >
                    {route.map(id => <RouteItem key={id} id={id}/>)}
                </SortableContext>
            </DndContext>
        </div>

    )

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;

        if (active.id !== over?.id) {
            setRoute((route) => {
                const oldIndex = route.indexOf(active.id as string);
                const newIndex = route.indexOf(over?.id as string);

                return arrayMove(route, oldIndex, newIndex);
            })
        }
    }
}

