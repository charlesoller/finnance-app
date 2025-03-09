'use client';

import AccountsList from './components/AccountList/AccountsList';
import { useDisclosure } from '@mantine/hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { formatNetWorthData } from './Accounts.utils';
import { useCustomerInfo } from '../../_utils/_hooks/useCustomerInfo';
import { useUserStore } from '../../_stores/UserStore';
import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../_services/StripeAPI';
import { ACCOUNT_TRANSACTIONS_KEY } from '../../_utils/_hooks/_mutations/queryKeys';
import { FeedDisplay } from './Accounts.types';
import { useMemo, useState } from 'react';
import { Flex, SegmentedControl } from '@mantine/core';
import AllTransactionsList from './components/AllTransactionsList/AllTransactionsList';
import {
  TransactionDataRequest,
  TransactionDataResponse,
  TransactionRange,
} from '../../_models/TransactionData';

export default function Accounts() {
  useCustomerInfo();

  const [feedDisplay, setFeedDisplay] = useState<FeedDisplay>('accounts');
  const [opened, { toggle }] = useDisclosure();

  const {
    handleSelectAcct,
    selectedAccountIds,
    isActiveAcctId,
    omittedAccounts,
    handleSelectTxn,
    isActiveTxnId,
    selectedTransactionIds,
  } = useChatContextStore();

  const { token, customerId } = useUserStore();
  const [graphRange, setGraphRange] = useState<TransactionRange>('week');

  const request: TransactionDataRequest = useMemo(
    () => ({
      customerId,
      range: graphRange,
      omit: omittedAccounts,
    }),
    [customerId, graphRange, omittedAccounts],
  );

  const { error, data, isFetching, isPending, isStale } =
    useQuery<TransactionDataResponse>({
      queryKey: [ACCOUNT_TRANSACTIONS_KEY, graphRange],
      queryFn: () => stripeAPI.getCustomerTransactionData(request, token),
      refetchOnWindowFocus: false,
      enabled: !!customerId && !!token,
      staleTime: Infinity,
    });

  const handleSelectAccount = (id: string) => {
    if (!opened) {
      toggle();
    }

    if (isActiveAcctId(id) && selectedAccountIds.length === 1) {
      toggle();
    }

    handleSelectAcct(id);
  };

  const handleSelectTransaction = (id: string) => {
    if (!opened) {
      toggle();
    }

    if (isActiveTxnId(id) && selectedTransactionIds.length === 1) {
      toggle();
    }

    handleSelectTxn(id);
  };

  return (
    <SlideDrawer
      opened={opened}
      side="right"
      drawerComponent={<Chat showHistoryMenu={false} />}
    >
      <>
        <Flex direction="column" gap="md">
          {(!!data?.running_total?.length || isFetching || isPending) && (
            <ValueTrackerChart
              data={
                data?.running_total
                  ? formatNetWorthData(data?.running_total)
                  : []
              }
              totalValue={
                data?.running_total ? data?.running_total?.[0]?.total / 100 : 0
              }
              showAddAccountButton
              loading={isPending || isStale}
              onRangeChange={(v) => setGraphRange(v)}
            />
          )}
          <SegmentedControl
            value={feedDisplay}
            data={[
              { label: 'Accounts', value: 'accounts' },
              { label: 'Transactions', value: 'transactions' },
            ]}
            onChange={(v) => setFeedDisplay(v as FeedDisplay)}
          />
          {feedDisplay === 'accounts' && (
            <AccountsList onSelect={handleSelectAccount} />
          )}
          {feedDisplay === 'transactions' && (
            <AllTransactionsList onSelect={handleSelectTransaction} />
          )}
        </Flex>
      </>
    </SlideDrawer>
  );
}
