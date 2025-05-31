import { create } from 'zustand';
import { WorkspaceState } from '@/types/workspace';
import { KanbanWorkspace } from './kanbanStore';

export interface WorkspacesData {
  workspaces: KanbanWorkspace[];
}

export const useWorkspacesStore = create<WorkspaceState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/workspaces/getWorkspaces`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data: WorkspacesData = await response.json();
      set({ data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
