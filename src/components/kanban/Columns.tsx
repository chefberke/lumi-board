"use client";

import React, { useState } from "react";
import Items from "@/components/kanban/Items";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
import { KanbanBoardProps, User, Column as KanbanColumn } from "@/types/kanban";
import { useKanban } from "@/hooks/useKanban";

export default function KanbanBoard({
  columns: initialColumns,
}: KanbanBoardProps) {
  const params = useParams();
  const workspaceId = params.id as string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);

  const { data: userData } = getMe();
  const { columns, isSaving, handleDragEnd, addCard, deleteCard } = useKanban(
    initialColumns,
    workspaceId
  );

  const handleAddCard = () => {
    if (!activeColumn || !newCardTitle.trim()) return;
    addCard(activeColumn.id, newCardTitle);
    setIsDialogOpen(false);
    setNewCardTitle("");
    setActiveColumn(null);
  };

  const openAddCardDialog = (column: KanbanColumn, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveColumn(column);
    setIsDialogOpen(true);
  };

  if (!userData) return null;

  const user: User = {
    user: {
      username: userData.user.username,
    },
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
                      className="bg-gray-50/50 group dark:bg-neutral-900 border border-gray-100/30 dark:border-neutral-900 rounded-lg shadow-sm md:w-72 min-w-[300px] flex flex-col h-full"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-2 border-b border-gray-100/30 cursor-grab active:cursor-grabbing flex-shrink-0"
                      >
                        <h3 className="pt-1.5 font-semibold text-gray-700 flex w-full justify-between dark:text-neutral-200">
                          <span>{column.title}</span>
                          <div>
                            <Plus
                              className="text-neutral-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              size={16}
                              onClick={(e) => openAddCardDialog(column, e)}
                            />
                          </div>
                        </h3>
                        <div className="text-xs text-neutral-600 pt-1 dark:text-neutral-400">
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
                            {column.cards.map((card, index) => (
                              <Items
                                key={card.id}
                                card={card}
                                index={index}
                                user={user}
                                onDelete={deleteCard}
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
