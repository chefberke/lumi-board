import axios from "axios";
import { WorkspaceState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";

export const getMe = create<WorkspaceState>((set) => ({
  data: [],
  loading: true,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/auth/getMe`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
