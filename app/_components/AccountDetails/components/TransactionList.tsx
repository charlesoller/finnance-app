import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../../_services/StripeAPI';
import { useUserStore } from '../../../_stores/UserStore';
import { useParams } from 'next/navigation';
import { Divider, Flex } from '@mantine/core';
import TransactionCard from './TransactionCard/TransactionCard';
import { TransactionData } from '../../../_models/TransactionData';
import { useChatContextStore } from '../../../_stores/ChatContextStore';
import { useMemo } from 'react';
import {
  GroupedTransactions,
  groupTransactionsByDate,
} from '../AccountDetails.utils';

interface TransactionListProps {
  onSelect: (id: string) => void;
}

export default function TransactionList({ onSelect }: TransactionListProps) {
  const { token } = useUserStore();
  const { isActiveTxnId } = useChatContextStore();
  const { accountId } = useParams();
  const {
    error,
    data: transactions,
    isLoading,
    isPending,
  } = useQuery<TransactionData[]>({
    queryKey: ['transactionData', accountId],
    queryFn: () => stripeAPI.getTransactions(accountId as string, token),
    refetchOnWindowFocus: false,
    enabled: !!accountId && !!token,
  });

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
              />
            ))}
          </Flex>
        ))}
    </Flex>
  );
}
