"use client";

import React, { useState } from "react";
import { InitialData } from "@/components/kanban/InitialData";
import Items from "@/components/kanban/Items";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";

export default function KanbanBoard() {
  const [columns, setColumns] = useState(InitialData.columns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns.find(
        (col) => col.id.toString() === source.droppableId
      );
      if (!column) return;

      const newCards = Array.from(column.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map((col) =>
        col.id.toString() === source.droppableId
          ? { ...col, cards: newCards }
          : col
      );
      setColumns(newColumns);
    } else {
      const sourceColumn = columns.find(
        (col) => col.id.toString() === source.droppableId
      );
      const destColumn = columns.find(
        (col) => col.id.toString() === destination.droppableId
      );
      if (!sourceColumn || !destColumn) return;

      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map((col) => {
        if (col.id.toString() === source.droppableId) {
          return { ...col, cards: sourceCards };
        }
        if (col.id.toString() === destination.droppableId) {
          return { ...col, cards: destCards };
        }
        return col;
      });
      setColumns(newColumns);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="flex gap-4 p-4 min-h-[400px]"
        style={{ position: "relative", zIndex: 1 }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-50/50 border border-gray-100/30 rounded-lg shadow-sm w-72 h-[400px]"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="p-3 border-b border-gray-100/30">
              <h3 className="font-medium text-gray-700">{column.title}</h3>
            </div>
            <Droppable droppableId={column.id.toString()}>
              {(provided: DroppableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-2 overflow-y-auto scrollbar-hide flex-1"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  {column.cards.map((card, index) => (
                    <Items key={card.id} card={card} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
