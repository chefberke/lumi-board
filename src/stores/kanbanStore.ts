import axios from "axios";
import { create } from "zustand";
import { API_URL } from "@/lib/config";
import { WorkspaceState } from "@/types/workspace";
import { Column, Card } from "@/types/kanban";

export const useKanbanStore = create<WorkspaceState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (workspaceId?: string) => {
    if (!workspaceId) return;

    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/workspaces/${workspaceId}`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  saveChanges: async (workspaceId: string, columns: Column[]) => {
    if (!workspaceId) return;

    try {
      const formattedColumns = columns.map((column) => ({
        id: column.id,
        title: column.title,
        cards: column.cards.map((card, index) => ({
          id: card.id,
          title: card.title,
          description: card.description || "",
          order: index,
          columnId: card.columnId || column.id,
          createdAt: card.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      }));

      const response = await axios.put(`${API_URL}/api/workspaces/${workspaceId}`, {
        columns: formattedColumns,
      });

      return response.data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
