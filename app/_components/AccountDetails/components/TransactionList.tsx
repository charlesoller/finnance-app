import { Divider, Flex } from '@mantine/core';
import TransactionCard from './TransactionCard/TransactionCard';
import { TransactionData } from '../../../_models/TransactionData';
import { useChatContextStore } from '../../../_stores/ChatContextStore';
import { useMemo } from 'react';
import {
  GroupedTransactions,
  groupTransactionsByDate,
} from '../AccountDetails.utils';
import { AccountData } from '../../../_models/AccountData';

interface TransactionListProps {
  onSelect: (id: string) => void;
  transactions: TransactionData[];
  account?: AccountData;
}

export default function TransactionList({
  onSelect,
  transactions,
  account,
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
              />
            ))}
          </Flex>
        ))}
    </Flex>
  );
}
