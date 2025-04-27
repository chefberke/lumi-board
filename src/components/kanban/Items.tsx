import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import Image from "next/image";

interface CardProps {
  card: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
  };
  index: number;
  user: any;
}

function Items({ card, index, user }: CardProps) {
  const date = new Date(card.createdAt);
  const formattedDate = date.toLocaleDateString("en-GB");
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
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
            <h4 className="font-medium text-gray-800 mb-1 text-sm md:text-base">
              {card.title}
            </h4>
            <p className="text-xs md:text-sm text-gray-600">
              {card.description}
            </p>
            <div className="flex justify-between w-full items-center pt-1 gap-2">
              <p className="text-neutral-600 text-xs font-normal">
                {formattedDate}
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-neutral-700 text-sm">{user.user.username}</p>
                <Image
                  src={
                    "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_1.png"
                  }
                  alt="user-image"
                  className="rounded-full border-2 border-neutral-700"
                  width={28}
                  height={28}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}

export default Items;
