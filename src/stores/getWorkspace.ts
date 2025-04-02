import { storeState } from "@/types/storeState";
import { create } from "zustand";

export const getWorkspaces = create<storeState>((set) => ({
  data: [],
  loading: true,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/workspaces/getWorkspaces`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      set({ data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false }); 
    }
  },
}));