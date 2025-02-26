'use client';

import styles from './AccountsList.module.css';

import { Divider, Flex, Loader, Text } from '@mantine/core';
import AccountCard from '../AccountCard/AccountCard';
import { AccountData } from '../../../../_models/AccountData';
import stripeAPI from '../../../../_services/StripeAPI';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../../_stores/UserStore';
import { useMemo } from 'react';
import { groupAccountsByType, GroupedAccounts } from '../../Accounts.utils';
import { capitalize } from '../../../../_utils/utils';
import { ACCOUNT_KEY } from '../../../../_utils/_hooks/_mutations/queryKeys';
import { usePollAccountBalances } from '../../../../_utils/_hooks/usePollAccountBalances';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';

interface AccountListProps {
  onSelect: (id: string) => void;
}

export default function AccountsList({ onSelect }: AccountListProps) {
  const { isActiveAcctId } = useChatContextStore();
  const { token, customerId } = useUserStore();

  const {
    error,
    data: accounts,
    isLoading,
    isPending,
  } = useQuery<AccountData[]>({
    queryKey: [ACCOUNT_KEY],
    queryFn: () => stripeAPI.getAccounts(customerId, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });

  usePollAccountBalances(accounts);

  const groupedAccounts = useMemo(() => {
    if (!accounts) return {};
    return groupAccountsByType(accounts);
  }, [accounts]);

  return (
    <Flex direction="column" className={styles.list}>
      {(isLoading || isPending) && <Loader color="green" />}
      {!!error && <Text>{error.message}</Text>}
      {!isLoading && !isPending && !error && !accounts?.length && (
        <Text>No data found</Text>
      )}
      {!!Object.keys(groupedAccounts)?.length &&
        Object.keys(groupedAccounts).map((group) => (
          <Flex key={group} direction="column">
            <Divider my="xs" label={capitalize(group)} labelPosition="left" />
            {groupedAccounts[group as keyof GroupedAccounts]!.map((acct) => (
              <AccountCard
                key={acct.id}
                acct={acct}
                selected={isActiveAcctId(acct.id)}
                onSelect={onSelect}
              />
            ))}
          </Flex>
        ))}
    </Flex>
  );
}
