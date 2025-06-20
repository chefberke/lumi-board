import { Column } from '@/types/kanban';

export interface Workspace {
  _id: string;
  title: string;
  owner: string;
  ownerId: string;
  members: string[];
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceState {
  data?: {
    workspaces?: Workspace[];
    workspace?: Workspace;
  } | null;
  loading?: boolean;
  error?: string | null;
  fetchData?: (workspaceId?: string, workspaceIds?: string) => Promise<void>;
  saveChanges?: (workspaceId: string, columns: Column[]) => Promise<any>;
}

export interface UserState {
  data: {
    user: {
      username: string;
      email: string;
    };
  } | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export interface Invite {
  id: string;
  boardId: string;
  boardName: string;
  inviterId: string;
  inviterName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface InviteStore {
  invites: Invite[];
  isLoading: boolean;
  error: string | null;
  fetchInvites: () => Promise<void>;
  acceptInvite: (inviteId: string) => Promise<void>;
  rejectInvite: (inviteId: string) => Promise<void>;
}

// Workspace Team Types
export interface TeamMember {
  id: string;
  username: string;
  role: 'owner' | 'member';
}

export interface WorkspaceTeamData {
  workspaceId: string;
  workspaceTitle: string;
  team: TeamMember[];
}

export interface WorkspaceTeamState {
  data?: WorkspaceTeamData | null;
  loading?: boolean;
  error?: string | null;
  fetchData?: (workspaceId: string) => Promise<void>;
}
