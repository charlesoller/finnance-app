'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Flex,
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
  ORDERED_ACCT_TYPES,
} from '../../Accounts.utils';
import { toTitleCase } from '../../../../_utils/utils';
import { ACCOUNT_KEY } from '../../../../_utils/_hooks/_mutations/queryKeys';
import { usePollAccountBalances } from '../../../../_utils/_hooks/usePollAccountBalances';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';

import {
  IconBuildingBank,
  IconCash,
  IconCoins,
  IconCreditCard,
  IconMoneybag,
} from '@tabler/icons-react';
import AccountsSkeleton from '../AccountsSkeleton/AccountsSkeleton';
import { useOmittedAccounts } from '../../../../_utils/_hooks/useOmittedAccounts';

interface AccountListProps {
  onSelect: (id: string) => void;
}

export default function AccountsList({ onSelect }: AccountListProps) {
  const { isActiveAcctId } = useChatContextStore();
  const { data: omittedAccounts } = useOmittedAccounts();
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

  const getIcon = (category: keyof GroupedAccounts) => {
    if (category === 'cash') {
      return <IconCash />;
    } else if (category === 'credit_card') {
      return <IconCreditCard />;
    } else if (category === 'loans') {
      return <IconBuildingBank />;
    } else if (category === 'savings') {
      return <IconMoneybag />;
    } else {
      return <IconCoins />;
    }
  };

  return (
    <Flex direction="column">
      {(isLoading || isPending) && <AccountsSkeleton />}
      {!!error && <Text>{error.message}</Text>}
      <Accordion
        multiple={true}
        defaultValue={['cash', 'savings', 'loans', 'credit_card', 'other']}
      >
        {ORDERED_ACCT_TYPES.map((group) => {
          if (!!groupedAccounts[group as keyof GroupedAccounts]) {
            return (
              <AccordionItem key={group} value={group}>
                <AccordionControl>
                  <Flex p="xs" justify="space-between">
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
                        omitted={omittedAccounts?.includes(acct.id) || false}
                      />
                    ),
                  )}
                </AccordionPanel>
              </AccordionItem>
            );
          }
        })}
      </Accordion>
    </Flex>
  );
}
