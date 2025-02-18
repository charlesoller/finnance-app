import { useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_KEY } from './_mutations/queryKeys';
import { AccountData } from '../../_models/AccountData';
import { useEffect, useMemo } from 'react';

export const usePollAccountBalances = (accounts?: AccountData[]) => {
  // Balance refreshing is done async by Stripe
  // This polls for account balances on initial integration

  // TODO: Add check for when next refresh is available, and refresh account if allowed to

  const queryClient = useQueryClient();
  const isRefreshed = useMemo(
    () => accounts?.every((acct) => acct.balance_refresh !== null),
    [accounts],
  );

  useEffect(() => {
    if (isRefreshed) return;

    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_KEY] });

      const currentIsRefreshed = accounts?.every(
        (acct) => acct.balance_refresh !== null || acct.status === 'inactive',
      );
      if (currentIsRefreshed) {
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [queryClient, isRefreshed, accounts]);
};
