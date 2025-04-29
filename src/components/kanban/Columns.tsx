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
import { getMe } from "@/stores/getMe";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KanbanBoardProps {
  columns: {
    id: string;
    title: string;
    cards: {
      id: string;
      title: string;
      description?: string;
      createdAt?: string;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [activeColumn, setActiveColumn] = useState<any>(null);

  const { data: userData } = getMe();

  const saveChangesToBackend = async (updatedColumns: any) => {
    try {
      setIsSaving(true);

      const formattedColumns = updatedColumns.map((column: any) => {
        return {
          id: column.id,
          title: column.title,
          cards: column.cards.map((card: any, index: number) => {
            return {
              id: card.id,
              title: card.title,
              description: card.description || "",
              order: index,
              columnId: card.columnId || column.id,
              ...(card.createdAt && { createdAt: card.createdAt }),
            };
          }),
        };
      });

      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ columns: formattedColumns }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server error details:", errorData);
        throw new Error(`Failed to save changes: ${response.status}`);
      }

      console.log("Changes saved successfully");
    } catch (error) {
      console.error("Backend save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = () => {
    if (!activeColumn || !newCardTitle.trim()) return;
    const timestamp = Math.floor(new Date().getTime() / 1000)
      .toString(16)
      .padStart(8, "0");
    const machineId = Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, "0");
    const processId = Math.floor(Math.random() * 65536)
      .toString(16)
      .padStart(4, "0");
    const counter = Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, "0");
    const newCardId = timestamp + machineId + processId + counter;

    const currentDate = new Date().toISOString();

    const updatedColumns = columns.map((col) => {
      if (col.id === activeColumn.id) {
        return {
          ...col,
          cards: [
            ...col.cards,
            {
              id: newCardId,
              title: newCardTitle.trim(),
              description: "",
              createdAt: currentDate,
              order: col.cards.length,
              columnId: col.id,
            },
          ],
        };
      }
      return col;
    });

    setColumns(updatedColumns);
    saveChangesToBackend(updatedColumns);

    setIsDialogOpen(false);
    setNewCardTitle("");
    setActiveColumn(null);
  };

  const openAddCardDialog = (column: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveColumn(column);
    setIsDialogOpen(true);
  };

  const handleDeleteCard = (cardId: string | number) => {
    const updatedColumns = columns.map((column) => {
      return {
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      };
    });

    setColumns(updatedColumns);
    saveChangesToBackend(updatedColumns);
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
          <div className="absolute top-2 right-2 bg-lumi text-white px-3 py-1 rounded-md text-sm">
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
                      className="bg-gray-50/50 group border border-gray-100/30 rounded-lg shadow-sm md:w-72 min-w-[300px] flex flex-col h-full"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-2 border-b border-gray-100/30 cursor-grab active:cursor-grabbing flex-shrink-0"
                      >
                        <h3 className="pt-1.5 font-semibold text-gray-700 flex w-full justify-between">
                          <span>{column.title}</span>
                          <div>
                            <Plus
                              className="text-neutral-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              size={16}
                              onClick={(e) => openAddCardDialog(column, e)}
                            />
                          </div>
                        </h3>
                        <div className="text-xs text-neutral-600 pt-1">
                          {column.cards.length} tasks
                        </div>
                      </div>
                      <Droppable droppableId={column.id.toString()} type="card">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="p-2 overflow-y-auto flex-1 custom-scrollbar"
                          >
                            {column.cards.map((card: any, index: any) => (
                              <Items
                                key={card.id}
                                card={card}
                                index={index}
                                user={userData}
                                onDelete={handleDeleteCard}
                              />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new task</DialogTitle>
            <DialogDescription>
              {activeColumn
                ? `Add a new task to the "${activeColumn.title}" column.`
                : "Add a new task."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="title"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Task title"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DragDropContext>
  );
}
