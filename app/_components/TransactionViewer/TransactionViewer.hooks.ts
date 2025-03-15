import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TransactionData,
  TransactionDataRequest,
  TransactionRange,
} from '../../_models/TransactionData';
import { ACCOUNT_TRANSACTIONS_KEY } from '../../_utils/_hooks/_mutations/queryKeys';
import stripeAPI from '../../_services/StripeAPI';
import { useUserStore } from '../../_stores/UserStore';
import { useEffect, useMemo, useState } from 'react';
import { getRecurringCharges } from './TransactionViewer.utils';
import { GroupedRecurringTransactions } from './components/RecurringTransactions/RecurringTransactions.types';

export const useTransactions = (
  range: TransactionRange = 'sixMonth',
  accountIds?: string[],
) => {
  const { token, customerId } = useUserStore();

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
    isFetching,
    isStale,
  } = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, range],
    queryFn: () => stripeAPI.getCustomerTransactionData(request, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
    staleTime: Infinity,
  });

  const filtered = useMemo(() => {
    if (!transactions) return [];

    if (!accountIds) return transactions;

    return transactions.filter((txn) => accountIds.includes(txn.account));
  }, [transactions, accountIds]);

  return {
    error,
    isLoading,
    isPending,
    isFetching,
    isStale,
    transactions: filtered,
  };
};

export const useRecurringTransactions = () => {
  // Attempts to get transactions from cache and then get the recurring charges
  // If cache miss, will fetch 6 month transactions
  const { customerId, token } = useUserStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [recurringTransactions, setRecurringTransactions] =
    useState<GroupedRecurringTransactions>({});

  useEffect(() => {
    const handleViewRecurring = () => {
      setLoading(true);
      // Get the data from the query cache for 'sixMonth' range
      const sixMonthData = queryClient.getQueryData<TransactionData[]>([
        ACCOUNT_TRANSACTIONS_KEY,
        'sixMonth',
      ]);

      // If the data exists in cache, use it; otherwise fetch it
      if (sixMonthData) {
        const recurringCharges = getRecurringCharges(sixMonthData);
        setRecurringTransactions(recurringCharges);
        setLoading(false);
        // Do something with the recurring charges
        console.log('Recurring charges:', recurringCharges);
      } else {
        queryClient
          .fetchQuery({
            queryKey: [ACCOUNT_TRANSACTIONS_KEY, 'sixMonth'],
            queryFn: () =>
              stripeAPI.getCustomerTransactionData(
                { customerId, range: 'sixMonth' },
                token,
              ),
          })
          .then((data) => {
            if (data) {
              const recurringCharges = getRecurringCharges(
                data as TransactionData[],
              );
              setRecurringTransactions(recurringCharges);
              setLoading(false);
            }
          });
      }
    };

    handleViewRecurring();
  }, [customerId, queryClient, token]);

  return {
    loading,
    recurringTransactions,
  };
};
