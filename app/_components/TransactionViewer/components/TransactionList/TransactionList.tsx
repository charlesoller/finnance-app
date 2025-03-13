import { Divider, Flex } from '@mantine/core';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';
import { useMemo } from 'react';
import { TransactionData } from '../../../../_models/TransactionData';
import { AccountData } from '../../../../_models/AccountData';
import TransactionCard from '../TransactionCard/TransactionCard';
import { groupTransactionsByDate } from '../../TransactionViewer.utils';
import { GroupedTransactions } from '../../TransactionViewer.types';

interface TransactionListProps {
  transactions: TransactionData[];
  onSelect?: (id: string) => void;
  account?: AccountData;
  showAccountName?: boolean;
  showDate?: boolean;
}

export default function TransactionList({
  onSelect,
  transactions,
  account,
  showAccountName,
  showDate,
}: TransactionListProps) {
  const { isActiveTxnId } = useChatContextStore();

  const groupedTransactions = useMemo((): GroupedTransactions => {
    if (!transactions?.length) return {};
    return groupTransactionsByDate(transactions);
  }, [transactions]);

  return (
    <Flex direction="column">
      {!!transactions?.length &&
        Object.keys(groupedTransactions).map((dateGroup) => (
          <Flex key={dateGroup} direction="column">
            <Divider my="xs" label={dateGroup} labelPosition="left" />
            {groupedTransactions[dateGroup].map((tx) => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                selected={isActiveTxnId(tx.id)}
                onSelect={onSelect}
                acct={account}
                showAccountName={showAccountName}
                showDate={showDate}
              />
            ))}
          </Flex>
        ))}
    </Flex>
  );
}
