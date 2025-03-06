import { useMutation, useQueryClient } from '@tanstack/react-query';
import stripeAPI from '../../../_services/StripeAPI';
import { useUserStore } from '../../../_stores/UserStore';
import { ACCOUNT_KEY, ACCOUNT_TRANSACTIONS_KEY } from './queryKeys';
import { useRouter } from 'next/navigation';

export const useDisconnectAccount = () => {
  const { token } = useUserStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (accountId: string) =>
      stripeAPI.disconnectAccount(accountId, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_KEY] });
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_TRANSACTIONS_KEY] });
      router.replace('/manage');
    },
  });

  return { mutation };
};
