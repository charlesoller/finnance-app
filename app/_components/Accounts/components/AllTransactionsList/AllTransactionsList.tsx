import { Flex, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ACCOUNT_TRANSACTIONS_KEY } from '../../../../_utils/_hooks/_mutations/queryKeys';
import stripeAPI from '../../../../_services/StripeAPI';
import { useUserStore } from '../../../../_stores/UserStore';
import TransactionList from '../../../AccountDetails/components/TransactionList';
import {
  TransactionData,
  TransactionDataRequest,
  TransactionRange,
} from '../../../../_models/TransactionData';
import RecurringTransactions from '../../../RecurringTransactions/RecurringTransactions';
import TransactionFilters from '../../../TransactionFilters/TransactionFilters';
import { PAGE_LENGTH } from '../../Accounts.types';
import { useCustomerInfo } from '../../../../_utils/_hooks/useCustomerInfo';

interface AllTransactionsListProps {
  onSelect: (id: string) => void;
}

export default function AllTransactionsList({
  onSelect,
}: AllTransactionsListProps) {
  useCustomerInfo();
  const { token, customerId } = useUserStore();
  const [range, setRange] = useState<TransactionRange>('week');
  const [page, setPage] = useState<number>(1);
  const [viewRecurring, setViewRecurring] = useState<boolean>(false);

  const request: TransactionDataRequest = useMemo(
    () => ({
      customerId,
      range,
    }),
    [customerId, range],
  );

  const {
    error,
    data: transactions,
    isLoading,
    isPending,
  } = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, range],
    queryFn: () => stripeAPI.getCustomerTransactionData(request, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });
  const paginatedTxns = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const result: TransactionData[][] = [];
    for (let i = 0; i < transactions.length; i += PAGE_LENGTH) {
      result.push(transactions.slice(i, i + PAGE_LENGTH));
    }
    return result;
  }, [transactions]);

  const getPaginationTotal = () => {
    if (!transactions) return 0;
    return Math.ceil(transactions.length / PAGE_LENGTH);
  };

  const handleRangeChange = (v: TransactionRange) => {
    setRange(v as TransactionRange);
    setPage(1);
  };

  const handleViewRecurringClick = () => {
    setViewRecurring((prev) => !prev);
  };

  return (
    <Flex direction="column">
      <TransactionFilters
        viewRecurring={viewRecurring}
        onViewRecurringClick={handleViewRecurringClick}
        range={range}
        rangeOnChange={handleRangeChange}
        disabled={!transactions}
        page={page}
        pageOnChange={setPage}
        paginationTotal={getPaginationTotal()}
      />
      {isLoading && <Loader color="green" m="auto" />}
      {!!transactions && !viewRecurring && (
        <TransactionList
          transactions={paginatedTxns[page - 1]}
          onSelect={onSelect}
        />
      )}
      {!!transactions && viewRecurring && (
        <RecurringTransactions onSelect={onSelect} />
      )}
    </Flex>
  );
}
