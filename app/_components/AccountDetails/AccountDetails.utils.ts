import { LineChartDataPoint } from '../../_models/ChartData';
import { TransactionData } from '../../_models/TransactionData';

export const formatTransactions = (
  tx: TransactionData[],
): LineChartDataPoint[] => {
  let runningTotal = 0;
  return tx
    .sort((a, b) => a.transacted_at - b.transacted_at)
    .map(({ amount, transacted_at }) => {
      runningTotal += amount;
      return {
        date: String(new Date(transacted_at * 1000)),
        amount: runningTotal,
      };
    });
};
