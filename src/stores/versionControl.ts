import axios from "axios";
import { create } from "zustand";

export const getVersionControl = create<any>((set) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`https://api.github.com/repos/lumi-work/lumi-board/commits`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
