import { WorkspaceState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";
import axios from 'axios';

export const delWorkspace = create<WorkspaceState>((set) => ({
  error: null,

  fetchData: async (id: String) => {
    set({ error: null });
    try {
      const response = await axios.delete(`${API_URL}/api/workspaces/deleteWorkspace`, { data: { id } });
      return response.data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
