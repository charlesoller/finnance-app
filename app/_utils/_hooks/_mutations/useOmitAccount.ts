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

    onMutate: async (accountId: string) => {
      await queryClient.cancelQueries({ queryKey: [OMITTED_ACCOUNTS] });

      const previousOmittedAccounts =
        queryClient.getQueryData<string[]>([OMITTED_ACCOUNTS]) || [];

      // Optimistically update the cache
      queryClient.setQueryData<string[]>([OMITTED_ACCOUNTS], (old = []) => {
        if (old.includes(accountId)) {
          return old.filter((id) => id !== accountId);
        }
        return [...old, accountId];
      });

      // Return the previous value so we can roll back if something goes wrong
      return { previousOmittedAccounts };
    },
    onError: (err, accountId, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousOmittedAccounts) {
        queryClient.setQueryData(
          [OMITTED_ACCOUNTS],
          context.previousOmittedAccounts,
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [OMITTED_ACCOUNTS] });
    },
  });

  return { mutation };
};
