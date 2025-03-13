import { useQuery } from '@tanstack/react-query';
import { OMITTED_ACCOUNTS } from './_mutations/queryKeys';
import userAPI from '../../_services/UserAPI';
import { useUserStore } from '../../_stores/UserStore';

export const useOmittedAccounts = () => {
  const { token, email } = useUserStore();

  const data = useQuery<string[]>({
    queryKey: [OMITTED_ACCOUNTS, 'threeMonth'],
    queryFn: () => userAPI.getOmittedAccounts(token, email),
    refetchOnWindowFocus: false,
    enabled: !!email && !!token,
    staleTime: Infinity,
  });

  return data;
};
