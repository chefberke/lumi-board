import axios from "axios";
import { WorkspaceState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";

export const signOut = create<WorkspaceState>((set) => ({
  data: [],
  loading: true,
  error: null,

  fetchData: async () => {
    set({ error: null });
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
