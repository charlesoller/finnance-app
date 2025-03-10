import { useEffect, useState } from 'react';
import { GroupedRecurringTransactions } from '../../_components/RecurringTransactions/RecurringTransactions.types';
import { useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_TRANSACTIONS_KEY } from './_mutations/queryKeys';
import { TransactionData } from '../../_models/TransactionData';
import { getRecurringCharges } from '../../_components/Accounts/Accounts.utils';
import stripeAPI from '../../_services/StripeAPI';
import { useUserStore } from '../../_stores/UserStore';

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
