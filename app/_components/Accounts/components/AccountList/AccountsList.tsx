'use client';

import styles from './AccountsList.module.css';

import { Divider, Flex, Loader, NumberFormatter, Text } from '@mantine/core';
import AccountCard from '../AccountCard/AccountCard';
import { AccountData } from '../../../../_models/AccountData';
import stripeAPI from '../../../../_services/StripeAPI';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../../_stores/UserStore';
import { useMemo } from 'react';
import {
  getCurrentNet,
  groupAccountsByType,
  GroupedAccounts,
} from '../../Accounts.utils';
import { capitalize } from '../../../../_utils/utils';

export default function AccountsList() {
  const { token, customerId, email } = useUserStore();

  const {
    error,
    data: accounts,
    isLoading,
    isPending,
  } = useQuery<AccountData[]>({
    queryKey: ['accountData'],
    queryFn: () => stripeAPI.getAccounts(customerId, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });

  const groupedAccounts = useMemo(() => {
    if (!accounts) return {};
    return groupAccountsByType(accounts);
  }, [accounts]);

  return (
    <Flex direction="column" className={styles.list}>
      {(!!isLoading || !!isPending) && <Loader />}
      {!!error && <Text>{error.message}</Text>}
      {!isLoading && !isPending && !error && !accounts?.length && (
        <Text>No data found</Text>
      )}
      <Text size="xl">
        Net Worth:
        <NumberFormatter
          prefix=" $"
          value={getCurrentNet(groupedAccounts) / 100 || 0}
          thousandSeparator
        />
      </Text>
      {!!Object.keys(groupedAccounts)?.length &&
        Object.keys(groupedAccounts).map((group) => (
          <Flex key={group} direction="column">
            <Divider my="xs" label={capitalize(group)} labelPosition="left" />
            {groupedAccounts[group as keyof GroupedAccounts]!.map((acct) => (
              <AccountCard key={acct.id} acct={acct} />
            ))}
          </Flex>
        ))}
    </Flex>
  );
}
