import { Column } from '@/types/kanban';

export interface Workspace {
  _id: string;
  title: string;
  owner: string;
  ownerId: string;
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
