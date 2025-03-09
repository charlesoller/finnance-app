export interface TransactionData {
  id: string;
  account: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  transacted_at: number;
}
export type TransactionRange = 'week' | 'month' | 'year' | 'all';
export interface TransactionDataRequest {
  customerId: string;
  range: TransactionRange;
  omit: string[];
}

export interface RunningTotalData {
  total: number;
  date: string;
}
export interface TransactionDataResponse {
  transactions: TransactionData[];
  running_total: RunningTotalData[];
}
