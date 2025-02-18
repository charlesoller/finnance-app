export interface TransactionData {
  id: string;
  account: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  transacted_at: number;
}
