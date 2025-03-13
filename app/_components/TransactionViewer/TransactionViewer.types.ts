import { TransactionData } from '../../_models/TransactionData';

export interface GroupedTransactions {
  [dateString: string]: TransactionData[];
}
