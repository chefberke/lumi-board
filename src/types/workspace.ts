export interface Workspace {
  _id: string;
  title: string;
  owner: string;
  columns: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceState {
  data?: any[] | null;
  loading?: boolean;
  error: string | null;
  fetchData: (...args: any[]) => Promise<void>;
}
