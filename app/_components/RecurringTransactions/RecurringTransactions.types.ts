import { TransactionData } from '../../_models/TransactionData';

export type ValidRecurrencePattern = 'weekly' | 'monthly' | 'yearly';
export interface RecurringTransactionsData {
  pattern: ValidRecurrencePattern;
  transactions: TransactionData[];
}
export interface GroupedRecurringTransactions {
  [key: string]: RecurringTransactionsData;
}
