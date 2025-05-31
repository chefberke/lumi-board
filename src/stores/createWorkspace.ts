import axios from "axios";
import { WorkspaceState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";

export const workspaceEvents = {
  onWorkspaceCreated: null as null | (() => void),
};

export const createWorkspace = create<WorkspaceState>((set) => ({
  error: null,

  fetchData: async (title: String) => {
    set({ error: null });
    try {
      const response = await axios.post(`${API_URL}/api/workspaces/createWorkspace`, { title });

      // Trigger workspace created event
      setTimeout(() => {
        if (workspaceEvents.onWorkspaceCreated) {
          workspaceEvents.onWorkspaceCreated();
        }
      }, 0);

      return response.data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
