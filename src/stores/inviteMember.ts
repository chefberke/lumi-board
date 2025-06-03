import axios from "axios";
import { WorkspaceState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";

export const inviteMember = create<WorkspaceState>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async (workspaceId, email) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/workspaces/invite`, {
        workspaceId,
        email,
      });
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
