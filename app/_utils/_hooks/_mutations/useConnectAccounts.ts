import { useMutation, useQueryClient } from '@tanstack/react-query';
import stripeAPI from '../../../_services/StripeAPI';
import { useUserStore } from '../../../_stores/UserStore';
import { ACCOUNT_KEY } from './queryKeys';

export const useConnectAccounts = () => {
  const { token, email } = useUserStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => stripeAPI.initiateStripeAuth(email, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_KEY] });
    },
  });

  return { mutation };
};
