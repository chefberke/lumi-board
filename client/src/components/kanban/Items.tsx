import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

interface CardProps {
  card: {
    id: number;
    title: string;
    description: string;
  };
  index: number;
}

function Items({ card, index }: CardProps) {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const style = {
          ...provided.draggableProps.style,
          position: "relative",
          zIndex: snapshot.isDragging ? 9999 : 1,
          transform: snapshot.isDragging
            ? provided.draggableProps.style?.transform
            : "none",
          pointerEvents: snapshot.isDragging ? "none" : "auto",
        } as React.CSSProperties;

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-2 p-3 bg-white rounded-md shadow-sm border border-gray-100/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
              snapshot.isDragging
                ? "shadow-lg ring-2 ring-blue-500/50 !fixed w-[288px]"
                : ""
            }`}
            style={style}
          >
            <h4 className="font-medium text-gray-800 mb-1">{card.title}</h4>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        );
      }}
    </Draggable>
  );
}

export default Items;
