import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Column, Card } from '@/types/kanban';
import { useKanbanStore } from '@/stores/kanbanStore';
import { v4 as uuidv4 } from 'uuid';

export const useKanban = (initialColumns: Column[], workspaceId: string) => {
  const [columns, setColumns] = useState(initialColumns || []);
  const [isSaving, setIsSaving] = useState(false);
  const saveChanges = useKanbanStore((state) => state.saveChanges);

  const saveChangesToBackend = async (updatedColumns: Column[]) => {
    if (!saveChanges) {
      console.error("Save changes function is not available");
      return;
    }

    try {
      setIsSaving(true);
      await saveChanges(workspaceId, updatedColumns);
    } catch (error) {
      console.error("Backend save error:", error);
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 500); // Add a small delay to show the saving indicator
    }
  };

  const handleDragEnd = (result: DropResult) => {
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
      const column = columns.find((col) => col.id.toString() === source.droppableId);
      if (!column) return;

      const newCards = Array.from(column.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map((col) =>
        col.id.toString() === source.droppableId ? { ...col, cards: newCards } : col
      );
      setColumns(newColumns);
      saveChangesToBackend(newColumns);
    } else {
      const sourceColumn = columns.find((col) => col.id.toString() === source.droppableId);
      const destColumn = columns.find((col) => col.id.toString() === destination.droppableId);
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
      saveChangesToBackend(newColumns);
    }
  };

  const addCard = (columnId: string, title: string) => {
    const newCardId = uuidv4();
    const currentDate = new Date();

    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: [
            ...col.cards,
            {
              id: newCardId,
              title: title.trim(),
              description: "",
              createdAt: currentDate,
              updatedAt: currentDate,
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
  };

  const deleteCard = (cardId: string) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    }));

    setColumns(updatedColumns);
    saveChangesToBackend(updatedColumns);
  };

  return {
    columns,
    isSaving,
    handleDragEnd,
    addCard,
    deleteCard,
  };
};
