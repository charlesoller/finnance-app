import { Flex, Paper } from '@mantine/core';
import ValueTrackerChart from '../../ValueTrackerChart/ValueTrackerChart';
import { TransactionData } from '../../../_models/TransactionData';
import { formatTransactions } from '../AccountDetails.utils';

interface AccountSummaryProps {
  transactions: TransactionData[];
}

export default function AccountSummary({ transactions }: AccountSummaryProps) {
  const formattedTransactions = formatTransactions(transactions);
  return (
    <Paper>
      <Flex w="100%" gap="md">
        <div style={{ flex: 1 }}>
          <ValueTrackerChart
            data={formattedTransactions}
            totalValue={
              formattedTransactions[formattedTransactions.length - 1].amount
            }
            totalValueLabel="Current Balance"
          />
        </div>
      </Flex>
    </Paper>
  );
}
