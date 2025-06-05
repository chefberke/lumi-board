import { create } from 'zustand';
import axios from 'axios';
import { InviteStore } from '@/types/workspace';
import { getWorkspaces } from './getWorkspace';

const store = create<InviteStore>((set, get) => ({
  invites: [],
  isLoading: false,
  error: null,

  fetchInvites: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/invites');
      set({ invites: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch invites', isLoading: false });
      throw error;
    }
  },

  acceptInvite: async (inviteId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`/api/invites/${inviteId}/accept`);

      // Update local state first
      set((state) => ({
        invites: state.invites.map((invite) =>
          invite.id === inviteId ? { ...invite, status: 'accepted' } : invite
        ),
        isLoading: false,
      }));

      // Refresh workspaces
      const { fetchData: refreshWorkspaces } = getWorkspaces();
      await refreshWorkspaces?.();

      // Refresh invites list
      await get().fetchInvites();

      return response.data;
    } catch (error) {
      set({ error: 'Failed to accept invite', isLoading: false });
      throw error;
    }
  },

  rejectInvite: async (inviteId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`/api/invites/${inviteId}/reject`);

      // Update local state
      set((state) => ({
        invites: state.invites.map((invite) =>
          invite.id === inviteId ? { ...invite, status: 'rejected' } : invite
        ),
        isLoading: false,
      }));

      // Refresh invites list
      await get().fetchInvites();
    } catch (error) {
      set({ error: 'Failed to reject invite', isLoading: false });
      throw error;
    }
  },
}));

export const useInviteStore = store;
