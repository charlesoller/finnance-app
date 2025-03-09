import { useQuery } from '@tanstack/react-query';
import {
  TransactionData,
  TransactionRange,
} from '../../_models/TransactionData';
import stripeAPI from '../../_services/StripeAPI';
import { ACCOUNT_TRANSACTIONS_KEY } from './_mutations/queryKeys';
import { useUserStore } from '../../_stores/UserStore';

export const useLoadTransactionInBackground = () => {
  const { token, customerId } = useUserStore();

  const weekQuery = {
    customerId,
    range: 'week' as TransactionRange,
  };

  const monthQuery = {
    customerId,
    range: 'month' as TransactionRange,
  };

  const threeMonthQuery = {
    customerId,
    range: 'threeMonth' as TransactionRange,
  };

  const sixMonthQuery = {
    customerId,
    range: 'sixMonth' as TransactionRange,
  };

  const weekRes = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, 'week'],
    queryFn: () => stripeAPI.getCustomerTransactionData(weekQuery, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
    staleTime: Infinity,
  });

  const monthRes = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, 'month'],
    queryFn: () => stripeAPI.getCustomerTransactionData(monthQuery, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token && !!weekRes?.data,
    staleTime: Infinity,
  });

  const threeMonthRes = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, 'threeMonth'],
    queryFn: () => stripeAPI.getCustomerTransactionData(threeMonthQuery, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token && !!monthRes?.data,
    staleTime: Infinity,
  });

  useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, 'sixMonth'],
    queryFn: () => stripeAPI.getCustomerTransactionData(sixMonthQuery, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token && !!threeMonthRes?.data,
    staleTime: Infinity,
  });
};
