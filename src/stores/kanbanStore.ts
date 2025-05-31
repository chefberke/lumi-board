import axios from "axios";
import { create } from "zustand";
import { API_URL } from "@/lib/config";
import { WorkspaceState } from "@/types/workspace";

export const useKanbanStore = create<WorkspaceState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (workspaceId: string) => {
    if (!workspaceId) return;

    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/workspaces/${workspaceId}`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
