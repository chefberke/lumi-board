import { create } from 'zustand';
import axios from 'axios';
import { InviteStore } from '@/types/workspace';

export const useInviteStore = create<InviteStore>((set) => ({
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
    }
  },

  acceptInvite: async (inviteId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`/api/invites/${inviteId}/accept`);
      set((state) => ({
        invites: state.invites.map((invite) =>
          invite.id === inviteId ? { ...invite, status: 'accepted' } : invite
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to accept invite', isLoading: false });
    }
  },

  rejectInvite: async (inviteId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`/api/invites/${inviteId}/reject`);
      set((state) => ({
        invites: state.invites.map((invite) =>
          invite.id === inviteId ? { ...invite, status: 'rejected' } : invite
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to reject invite', isLoading: false });
    }
  },
}));
