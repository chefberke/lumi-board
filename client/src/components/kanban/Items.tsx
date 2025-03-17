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
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-2 p-3 bg-white rounded-md shadow-sm border-2 border-gray-100/50 hover:shadow-md hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing ${
              snapshot.isDragging
                ? "shadow-lg ring-2 ring-primary opacity-100 backdrop-blur-md"
                : ""
            }`}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.9 : 1,
              zIndex: snapshot.isDragging ? 9999 : 9999,
            }}
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
