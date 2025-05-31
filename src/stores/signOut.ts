import { WorkspaceState } from "@/types/workspace";
import { create } from "zustand";

export const signOut = create<WorkspaceState>((set) => ({
  data: [],
  loading: true,
  error: null,

  fetchData: async () => {
    set({ error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/logout`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
