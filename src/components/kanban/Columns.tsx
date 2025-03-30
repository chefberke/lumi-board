"use client";

import React, { useState } from "react";
import { InitialData } from "@/components/kanban/InitialData";
import Items from "@/components/kanban/Items";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function KanbanBoard() {
  const [columns, setColumns] = useState(InitialData.columns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    // Handle column reordering
    if (type === "column") {
      const newColumns = Array.from(columns);
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);
      setColumns(newColumns);
      return;
    }

    // Handle card reordering within the same column
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
      // Handle card movement between columns
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
      <Droppable droppableId="columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col md:flex-row gap-4 p-4 min-h-[400px] overflow-x-auto custom-scrollbar"
          >
            {columns.map((column, index) => (
              <Draggable
                key={column.id}
                draggableId={`column-${column.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-gray-50/50 border border-gray-100/30 rounded-lg shadow-sm w-full md:w-72 min-w-[300px] mb-4 md:mb-0 h-auto md:h-[350px] flex flex-col"
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="p-2 border-b border-gray-100/30 cursor-grab active:cursor-grabbing"
                    >
                      <h3 className="pt-1.5 font-medium text-gray-700">
                        {column.title}
                      </h3>
                    </div>
                    <Droppable droppableId={column.id.toString()} type="card">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="p-2 overflow-y-auto flex-1 custom-scrollbar"
                        >
                          {column.cards.map((card, index) => (
                            <Items key={card.id} card={card} index={index} />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
