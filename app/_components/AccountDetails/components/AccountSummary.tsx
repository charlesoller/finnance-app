import { Flex, Paper } from '@mantine/core';
import ValueTrackerChart from '../../ValueTrackerChart/ValueTrackerChart';
import { TransactionData } from '../../../_models/TransactionData';
import { formatTransactions } from '../AccountDetails.utils';

interface AccountSummaryProps {
  transactions: TransactionData[];
}

export default function AccountSummary({ transactions }: AccountSummaryProps) {
  return (
    <Paper>
      <Flex w="100%" gap="md">
        <div style={{ flex: 1 }}>
          <ValueTrackerChart data={formatTransactions(transactions)} />
        </div>
      </Flex>
    </Paper>
  );
}
