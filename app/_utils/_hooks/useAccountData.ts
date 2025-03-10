import { useEffect, useState } from 'react';
import { ACCOUNT_KEY } from './_mutations/queryKeys';
import { AccountData } from '../../_models/AccountData';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../_stores/UserStore';
import stripeAPI from '../../_services/StripeAPI';

export const useAccountData = (id?: string) => {
  // Attempts to get account data from cache and then get the recurring charges
  // If cache miss, will fetch 6 month transactions
  const { customerId, token } = useUserStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [accountData, setAccountData] = useState<AccountData>();

  useEffect(() => {
    const getAccountData = () => {
      if (!id || !token) return;
      setLoading(true);

      const allAcctData = queryClient.getQueryData<AccountData[]>([
        ACCOUNT_KEY,
      ]);
      if (allAcctData) {
        const targetAcctData = allAcctData.find((acct) => acct.id === id);
        if (targetAcctData) {
          setAccountData(targetAcctData);
          setLoading(false);
          return;
        }
      }

      const specificAcctData = queryClient.getQueryData<AccountData>([
        ACCOUNT_KEY,
        id,
      ]);
      if (specificAcctData) {
        setAccountData(specificAcctData);
        setLoading(false);
        return;
      }

      queryClient
        .fetchQuery({
          queryKey: [ACCOUNT_KEY, id],
          queryFn: () => stripeAPI.getAccountById(id, token),
        })
        .then((data) => {
          if (data) {
            setAccountData(data);
            setLoading(false);
          }
          return data;
        });
    };

    getAccountData();
  }, [customerId, queryClient, token, id]);

  return {
    loading,
    accountData,
  };
};
