import { Flex, Paper } from '@mantine/core';
import ValueTrackerChart from '../../ValueTrackerChart/ValueTrackerChart';
import { TransactionData } from '../../../_models/TransactionData';
import { formatTransactions } from '../AccountDetails.utils';

interface AccountSummaryProps {
  transactions: TransactionData[];
  balance: number;
}

export default function AccountSummary({
  transactions,
  balance,
}: AccountSummaryProps) {
  const formattedTransactions = formatTransactions(transactions, balance);
  return (
    <Paper>
      <Flex w="100%" gap="md">
        <div style={{ flex: 1 }}>
          <ValueTrackerChart
            data={formattedTransactions}
            totalValue={balance}
            totalValueLabel="Current Balance"
          />
        </div>
      </Flex>
    </Paper>
  );
}
