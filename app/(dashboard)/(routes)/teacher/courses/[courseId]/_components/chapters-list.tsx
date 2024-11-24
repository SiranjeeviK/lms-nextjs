"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersList = ({
  items,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  // The isMounted state is used to avoid hydration issues
  // Eventhough this is client side component, it is still rendered on the server
  // And the Drag and Drop library used here is not compatible with server side rendering
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1); // Remove the reordered item, it returns an array so we get the first item and name it reorderedItem
    items.splice(result.destination.index, 0, reorderedItem); // Insert the reordered item at the destination index

    const updatedChapters = Array.from(items);

    setChapters(updatedChapters);

    const bulkUpdateData = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index,
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => {
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {chapters.map((chapter, index) => (
                  <Draggable
                    key={chapter.id}
                    draggableId={chapter.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className={cn(
                          "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded md mb-4 text-sm",
                          chapter.isPublished &&
                            "bg-sky-100 border-sky-200 text-sky-700"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div
                          className={cn(
                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                            chapter.isPublished &&
                              "border-r-sky-200 hover:border-sky-300"
                          )}
                          {...provided.dragHandleProps}
                        >
                          <Grip className="h-5 w-5" />
                        </div>
                        <div>{chapter.title}</div>
                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                          {chapter.isFree && <Badge>Free</Badge>}
                          <Badge
                            className={cn(
                              "bg-slate-500",
                              chapter.isPublished && "bg-sky-700"
                            )}
                          >
                            {chapter.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Pencil
                            onClick={() => {
                              onEdit(chapter.id);
                            }}
                            className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
