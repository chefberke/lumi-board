import axios from "axios";
import { WorkspaceState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";

export const updateWorkspace = create<WorkspaceState>((set) => ({
  error: null,

  fetchData: async (id: String, name: String) => {
    set({ error: null });
    try {
      const response = await axios.patch(`${API_URL}/api/workspaces/updateWorkspace`, {
        id,
        title: name,
      });

      return response.data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
