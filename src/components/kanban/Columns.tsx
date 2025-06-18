"use client";

import React, { useState, useEffect } from "react";
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
import { useSocket } from "@/hooks/useSocket";

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
  const { on, off } = useSocket();

  useEffect(() => {
    // Socket event listeners
    on("task:created", (data) => {
      // Handle task creation
    });

    on("task:deleted", (data) => {
      // Handle task deletion
    });

    on("task:updated", (data) => {
      // Handle task update
    });

    on("column:reordered", (data) => {
      // Handle column reorder
    });

    on("task:dragged", (data) => {
      // Handle task drag
    });

    return () => {
      // Cleanup socket listeners
      off("task:created");
      off("task:deleted");
      off("task:updated");
      off("column:reordered");
      off("task:dragged");
    };
  }, [on, off]);

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
              className="flex md:flex-row gap-4 overflow-x-auto pb-4 items-start"
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
                      className="bg-gray-50/50 group dark:bg-neutral-900 border border-gray-100/30 dark:border-neutral-900 rounded-lg shadow-sm md:w-72 min-w-[300px] flex flex-col"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="px-4 py-2 cursor-grab active:cursor-grabbing flex-shrink-0"
                      >
                        <h3 className="pt-1.5 font-semibold text-gray-700 flex w-full justify-between dark:text-neutral-200">
                          <span>{column.title}</span>
                        </h3>
                        <div className="text-xs text-neutral-600 pt-1 dark:text-neutral-400">
                          {column.cards.length} tasks
                        </div>
                      </div>
                      <div
                        className="flex flex-col"
                        style={{ maxHeight: "700px" }}
                      >
                        <Droppable
                          droppableId={column.id.toString()}
                          type="card"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="p-2 overflow-y-auto scrollbar-hide"
                              style={{
                                minHeight:
                                  column.cards.length === 0 ? "20px" : "50px",
                                maxHeight: "600px",
                              }}
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
                        {/* Separator line when items exist */}
                        {column.cards.length > 0 && (
                          <div className="mx-2 border-t border-gray-200 dark:border-neutral-700 opacity-30"></div>
                        )}
                        <div
                          onClick={(e) => openAddCardDialog(column, e)}
                          className={`p-2 mx-2 mb-2 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-gray-300 dark:hover:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors group/add flex-shrink-0 ${
                            column.cards.length > 0 ? "mt-3" : "mt-0"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-neutral-400 group-hover/add:text-gray-600 dark:group-hover/add:text-neutral-300">
                            <Plus size={16} />
                            <span className="text-sm font-medium">
                              Add item
                            </span>
                          </div>
                        </div>
                      </div>
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
            <Button
              variant="outline"
              size={"sm"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCard}
              variant="default"
              size={"sm"}
              className="bg-lumi"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DragDropContext>
  );
}
