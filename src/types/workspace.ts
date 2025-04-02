export interface Workspace {
  _id: string;
  title: string;
  owner: string;
  columns: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceState {
  data: {
    workspaces: Workspace[];
  } | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}