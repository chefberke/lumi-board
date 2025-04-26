"use client";

import React, { useState, useEffect } from "react";
import Items from "@/components/kanban/Items";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useParams } from "next/navigation";

interface KanbanBoardProps {
  columns: {
    id: string;
    title: string;
    cards: {
      id: string;
      title: string;
      description: string;
    }[];
  }[];
}

export default function KanbanBoard({
  columns: initialColumns,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns || []);
  const params = useParams();
  const workspaceId = params.id as string;
  const [isSaving, setIsSaving] = useState(false);

  const saveChangesToBackend = async (updatedColumns: any) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ columns: updatedColumns }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      console.log("Changes saved successfully");
    } catch (error) {
      console.error("Backend save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const newColumns = Array.from(columns);
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);
      setColumns(newColumns);
      saveChangesToBackend(newColumns);
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const column = columns.find(
        (col: any) => col.id.toString() === source.droppableId
      );
      if (!column) return;

      const newCards = Array.from(column.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map((col: any) =>
        col.id.toString() === source.droppableId
          ? { ...col, cards: newCards }
          : col
      );
      setColumns(newColumns);
      saveChangesToBackend(newColumns);
    } else {
      const sourceColumn = columns.find(
        (col: any) => col.id.toString() === source.droppableId
      );
      const destColumn = columns.find(
        (col: any) => col.id.toString() === destination.droppableId
      );
      if (!sourceColumn || !destColumn) return;

      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map((col: any) => {
        if (col.id.toString() === source.droppableId) {
          return { ...col, cards: sourceCards };
        }
        if (col.id.toString() === destination.droppableId) {
          return { ...col, cards: destCards };
        }
        return col;
      });
      setColumns(newColumns);
      saveChangesToBackend(newColumns);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 overflow-hidden h-full relative">
        {isSaving && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
            Saving...
          </div>
        )}
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex md:flex-row gap-4 overflow-x-auto overflow-y-hidden h-full pb-4"
            >
              {columns.map((column: any, index: any) => (
                <Draggable
                  key={column.id}
                  draggableId={`column-${column.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-50/50 border border-gray-100/30 rounded-lg shadow-sm md:w-72 min-w-[300px] flex flex-col h-full"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-2 border-b border-gray-100/30 cursor-grab active:cursor-grabbing flex-shrink-0"
                      >
                        <h3 className="pt-1.5 font-semibold text-gray-700">
                          {column.title}
                          <div className="text-xs text-neutral-600 pt-1">
                            {column.cards.length} tasks
                          </div>
                        </h3>
                      </div>
                      <Droppable droppableId={column.id.toString()} type="card">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="p-2 overflow-y-auto flex-1 custom-scrollbar"
                          >
                            {column.cards.map((card: any, index: any) => (
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
      </div>
    </DragDropContext>
  );
}
