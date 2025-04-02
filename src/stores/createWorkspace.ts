import { storeState } from "@/types/storeState";
import { create } from "zustand";

export const workspaceEvents = {
  onWorkspaceCreated: null as null | (() => void),
};

export const createWorkspace = create<storeState>((set) => ({
  error: null,

  fetchData: async (title: String) => {
    set({ error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/workspaces/createWorkspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({title})
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to post: ${response.status}`);
      }

      const data = await response.json();
      
      // Trigger workspace created event
      setTimeout(() => {
        if (workspaceEvents.onWorkspaceCreated) {
          workspaceEvents.onWorkspaceCreated();
        }
      }, 0);
      
      return data;
    } catch (error: any) {
      set({ error: error.message }); 
      throw error;
    }
  },
}));