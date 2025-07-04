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
import { useSocket } from "@/hooks/useSocket";

function Items({ card, index, user, onDelete }: CardProps) {
  const { emit } = useSocket();
  const date = new Date(card.createdAt || "");

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else {
      return date.toLocaleDateString("en-GB");
    }
  };

  const formattedDate = getRelativeTime(date);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      emit("task:delete", { id: card.id });
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
          className={`dark:bg-neutral-900 dark:border-none mb-2 p-3 bg-white rounded-md shadow-sm border-2 border-gray-100/50 hover:shadow-md hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing w-full break-words ${
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
            <h4 className="font-medium text-gray-800 text-sm md:text-base dark:text-neutral-300 flex-1 mr-2 line-clamp-2 break-words">
              {card.title}
            </h4>
            {onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-gray-100  dark:hover:bg-transparent opacity-0 group-hover:opacity-100">
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

          <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300 line-clamp-3 break-words">
            {card.description}
          </p>
          <div className="flex justify-between w-full items-center pt-1 gap-2">
            <p className="text-neutral-600 text-xs font-normal dark:text-neutral-400">
              {formattedDate}
            </p>
            <div className="flex items-center gap-1.5">
              {card.assignee ? (
                <>
                  <p className="text-neutral-700 text-sm dark:text-neutral-300">
                    {card.assignee.username}
                  </p>
                  <div className="w-5 h-5 rounded-full bg-lumi flex items-center justify-center">
                    <span className="text-white text-xs font-normal">
                      {card.assignee.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-neutral-700 text-sm dark:text-neutral-300">
                    Unassigned
                  </p>
                  <div className="w-5 h-5 rounded-full bg-gray-400 dark:bg-neutral-800 flex items-center justify-center">
                    <span className="text-white text-xs font-normal">?</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Items;
