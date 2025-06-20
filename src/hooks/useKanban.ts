import { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Column, Card } from '@/types/kanban';
import { useKanbanStore } from '@/stores/kanbanStore';
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from './useSocket';

export const useKanban = (initialColumns: Column[], workspaceId: string) => {
  const [columns, setColumns] = useState(initialColumns || []);
  const [isSaving, setIsSaving] = useState(false);
  const saveChanges = useKanbanStore((state) => state.saveChanges);
  const { emit, on, off } = useSocket();

  useEffect(() => {
    // Socket event listener'ları
    on('task:created', (data) => {
      const updatedColumns = columns.map((col) => {
        if (col.id === data.columnId) {
          return {
            ...col,
            cards: [...col.cards, data],
          };
        }
        return col;
      });
      setColumns(updatedColumns);
    });

    on('task:deleted', (data) => {
      const updatedColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== data.taskId),
      }));
      setColumns(updatedColumns);
    });

    on('task:updated', (data) => {
      const updatedColumns = columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === data.id ? { ...card, ...data } : card
        ),
      }));
      setColumns(updatedColumns);
    });

    on('column:reordered', (data) => {
      setColumns(data.columns);
    });

    on('task:dragged', (data) => {
      const { source, destination } = data;
      if (!destination) return;

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
      }
    });

    return () => {
      off('task:created');
      off('task:deleted');
      off('task:updated');
      off('column:reordered');
      off('task:dragged');
    };
  }, [columns, on, off]);

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
      }, 500);
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
      emit('column:reorder', { columns: newColumns });
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
      emit('task:drag', result);
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
      emit('task:drag', result);
    }
  };

  const addCard = (columnId: string, title: string, description: string, assignee?: { id: string; username: string } | null) => {
    const newCardId = uuidv4();
    const currentDate = new Date();

    const newCard = {
      id: newCardId,
      title: title.trim(),
      description: description.trim() || undefined,
      assignee: assignee ? { _id: assignee.id, id: assignee.id, username: assignee.username } : undefined,
      createdAt: currentDate,
      updatedAt: currentDate,
      order: columns.find(col => col.id === columnId)?.cards.length || 0,
      columnId: columnId,
    };

    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: [...col.cards, newCard],
        };
      }
      return col;
    });

    setColumns(updatedColumns);
    saveChangesToBackend(updatedColumns);
    emit('task:create', newCard);
  };

  const deleteCard = (cardId: string) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    }));

    setColumns(updatedColumns);
    saveChangesToBackend(updatedColumns);
    emit('task:delete', { taskId: cardId });
  };

  return {
    columns,
    isSaving,
    handleDragEnd,
    addCard,
    deleteCard,
  };
};
