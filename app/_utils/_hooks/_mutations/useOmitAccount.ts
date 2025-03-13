import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../../_stores/UserStore';
import { OMITTED_ACCOUNTS } from './queryKeys';
import userAPI from '../../../_services/UserAPI';

export const useOmitAccount = () => {
  const { token, email } = useUserStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (accountId: string) =>
      userAPI.omitAccount(token, email, accountId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [OMITTED_ACCOUNTS] });
    },
  });

  return { mutation };
};
