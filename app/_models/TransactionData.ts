export interface TransactionData {
  id: string;
  account: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  transacted_at: number;
  institution_name?: string;
  acct_display_name?: string;
}
export type TransactionRange = 'week' | 'month' | 'threeMonth' | 'sixMonth';
export interface TransactionDataRequest {
  customerId: string;
  range: TransactionRange;
}

export interface RunningTotalData {
  total: number;
  date: string;
}
// export interface TransactionDataResponse {
//   transactions: TransactionData[];
//   running_total: RunningTotalData[];
// }
