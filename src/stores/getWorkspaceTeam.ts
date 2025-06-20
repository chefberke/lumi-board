import axios from "axios";
import { WorkspaceTeamState } from "@/types/workspace";
import { API_URL } from "@/lib/config";
import { create } from "zustand";

export const getWorkspaceTeam = create<WorkspaceTeamState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/workspaces/getWorkspaceTeam?id=${workspaceId}`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
