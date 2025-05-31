import { create } from 'zustand';
import { WorkspaceState } from '@/types/workspace';

export interface Card {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface KanbanWorkspace {
  id: string;
  title: string;
  columns: Column[];
}

export interface KanbanData {
  workspace: KanbanWorkspace;
}

export const useKanbanStore = create<WorkspaceState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (workspaceId: string) => {
    if (!workspaceId) return;

    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data: KanbanData = await response.json();
      set({ data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
