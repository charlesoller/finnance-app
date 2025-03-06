'use client';

import styles from './AccountsList.module.css';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Flex,
  Loader,
  NumberFormatter,
  Text,
  Title,
} from '@mantine/core';
import AccountCard from '../AccountCard/AccountCard';
import { AccountData } from '../../../../_models/AccountData';
import stripeAPI from '../../../../_services/StripeAPI';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../../_stores/UserStore';
import { useMemo } from 'react';
import {
  getTotal,
  groupAccountsByType,
  GroupedAccounts,
} from '../../Accounts.utils';
import { toTitleCase } from '../../../../_utils/utils';
import { ACCOUNT_KEY } from '../../../../_utils/_hooks/_mutations/queryKeys';
import { usePollAccountBalances } from '../../../../_utils/_hooks/usePollAccountBalances';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';

import {
  IconCash,
  IconCoins,
  IconCreditCard,
  IconHome,
  IconMoneybag,
} from '@tabler/icons-react';
import AddAccountButton from '../../../AddAccountButton/AddAccountButton';

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
  console.log('ACCOUNTS: ', accounts);
  usePollAccountBalances(accounts);

  const groupedAccounts = useMemo(() => {
    if (!accounts) return {};
    return groupAccountsByType(accounts);
  }, [accounts]);

  const getIcon = (category: keyof GroupedAccounts) => {
    if (category === 'checking') {
      return <IconCash />;
    } else if (category === 'credit_card') {
      return <IconCreditCard />;
    } else if (category === 'mortgage') {
      return <IconHome />;
    } else if (category === 'savings') {
      return <IconMoneybag />;
    } else {
      return <IconCoins />;
    }
  };

  return (
    <Flex direction="column" className={styles.list} mt="sm">
      {(isLoading || isPending) && <Loader color="green" m="auto" />}
      {!!error && <Text>{error.message}</Text>}
      {!isLoading && !isPending && !error && !accounts?.length && (
        <Flex direction="column" m="auto" ta="center">
          <Title>No Accounts Connected</Title>
          <Text mb="lg">
            Use the add account button below to get started with integrating
            your accounts
          </Text>
          <AddAccountButton />
        </Flex>
      )}
      <Accordion
        multiple={true}
        defaultValue={[
          'checking',
          'savings',
          'mortgage',
          'credit_card',
          'other',
        ]}
      >
        {Object.keys(groupedAccounts)
          .reverse()
          .map((group) => (
            <AccordionItem key={group} value={group}>
              <AccordionControl>
                <Flex p="md" justify="space-between">
                  <Flex align="center" gap="md">
                    {getIcon(group as keyof GroupedAccounts)}
                    <Title order={3}>{toTitleCase(group)}</Title>
                  </Flex>
                  <Title
                    order={3}
                    c={group === 'credit_card' ? 'red' : 'green'}
                  >
                    <NumberFormatter
                      prefix="$"
                      value={
                        getTotal(
                          groupedAccounts[group as keyof GroupedAccounts]!,
                        ) / 100
                      }
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </Title>
                </Flex>
              </AccordionControl>
              <AccordionPanel>
                {groupedAccounts[group as keyof GroupedAccounts]!.map(
                  (acct) => (
                    <AccountCard
                      key={acct.id}
                      acct={acct}
                      selected={isActiveAcctId(acct.id)}
                      onSelect={onSelect}
                    />
                  ),
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </Flex>
  );
}
