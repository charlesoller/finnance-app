import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../../_services/StripeAPI';
import { useUserStore } from '../../../_stores/UserStore';
import { useParams } from 'next/navigation';
import { Flex } from '@mantine/core';
import TransactionCard from './TransactionCard/TransactionCard';
import { TransactionData } from '../../../_models/TransactionData';

interface TransactionListProps {
  onSelect: (id: string) => void;
  selectedTransactions: string[];
}

export default function TransactionList({
  onSelect,
  selectedTransactions,
}: TransactionListProps) {
  const { token } = useUserStore();
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

  return (
    <Flex direction="column">
      {!!transactions?.length &&
        transactions.map((tx) => (
          <TransactionCard
            key={tx.id}
            tx={tx}
            selected={selectedTransactions.includes(tx.id)}
            onSelect={onSelect}
          />
        ))}
    </Flex>
  );
}
