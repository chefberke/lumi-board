import { storeState } from "@/types/storeState";
import { create } from "zustand";

export const createWorkspace = create<storeState>((set) => ({
  error: null,

  fetchData: async (id: String) => {
    set({ error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/workspaces/deleteWorkspace`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({id})
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to patch: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
