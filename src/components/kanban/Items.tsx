import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { Ellipsis, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardProps } from "@/types/kanban";

function Items({ card, index, user, onDelete }: CardProps) {
  const date = new Date(card.createdAt || "");
  const formattedDate = date.toLocaleDateString("en-GB");

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card.id);
    }
  };

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 p-3 bg-white rounded-md shadow-sm border-2 border-gray-100/50 hover:shadow-md hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing w-full break-words ${
            snapshot.isDragging
              ? "shadow-lg ring-2 ring-primary opacity-100 backdrop-blur-md"
              : ""
          }`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            zIndex: snapshot.isDragging ? 1000 : 1,
          }}
        >
          <div className="flex justify-between items-start mb-1 group">
            <h4 className="font-medium text-gray-800 text-sm md:text-base">
              {card.title}
            </h4>
            {onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100">
                    <Ellipsis size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-400 text-xs"
                  >
                    <Trash size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-xs md:text-sm text-gray-600">{card.description}</p>
          <div className="flex justify-between w-full items-center pt-1 gap-2">
            <p className="text-neutral-600 text-xs font-normal">
              {formattedDate}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-neutral-700 text-sm">{user.user.username}</p>
              <Image
                src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_1.png"
                alt="user-image"
                className="rounded-full border-2 border-neutral-700"
                width={25}
                height={25}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Items;
