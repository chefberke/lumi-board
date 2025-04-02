export interface storeState {
    data?: any; 
    loading?: boolean; 
    error: string | null; 
    fetchData: (value?: any) => Promise<void>;
  }