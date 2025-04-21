export interface storeState {
    data?: any;
    loading?: boolean;
    error: string | null;
    fetchData: (value?: any ,value2?: any) => Promise<void>;
  }
