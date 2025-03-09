'use client';

import AccountsList from './components/AccountList/AccountsList';
import { useDisclosure } from '@mantine/hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { computeTransactionData, formatNetWorthData } from './Accounts.utils';
import { useCustomerInfo } from '../../_utils/_hooks/useCustomerInfo';
import { useUserStore } from '../../_stores/UserStore';
import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../_services/StripeAPI';
import {
  ACCOUNT_KEY,
  ACCOUNT_TRANSACTIONS_KEY,
} from '../../_utils/_hooks/_mutations/queryKeys';
import { FeedDisplay } from './Accounts.types';
import { useMemo, useState } from 'react';
import { Flex, SegmentedControl } from '@mantine/core';
import AllTransactionsList from './components/AllTransactionsList/AllTransactionsList';
import {
  TransactionData,
  TransactionDataRequest,
  TransactionRange,
} from '../../_models/TransactionData';
import { AccountData } from '../../_models/AccountData';
import { useLoadTransactionInBackground } from '../../_utils/_hooks/useLoadTransactionsInBackground';

export default function Accounts() {
  useCustomerInfo();
  useLoadTransactionInBackground();

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
    }),
    [customerId, graphRange],
  );

  const {
    error: acctError,
    data: accts,
    isFetching: acctFetching,
    isPending: acctPending,
  } = useQuery<AccountData[]>({
    queryKey: [ACCOUNT_KEY],
    queryFn: () => stripeAPI.getAccounts(customerId, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });

  const {
    error: txnError,
    data: txns,
    isFetching: txnFetching,
    isPending: txnPending,
    isStale: txnStale,
  } = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, graphRange],
    queryFn: () => stripeAPI.getCustomerTransactionData(request, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
    staleTime: Infinity,
  });
  console.log('Accts: ', accts);
  console.log('TXNS: ', txns);
  const computedTxnData = useMemo(
    () => computeTransactionData(accts, txns, omittedAccounts),
    [accts, txns, omittedAccounts],
  );
  console.log('COMPUTED: ', computedTxnData);

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
          {(!!computedTxnData ||
            txnFetching ||
            txnPending ||
            acctFetching ||
            acctPending) && (
            <ValueTrackerChart
              data={computedTxnData ? formatNetWorthData(computedTxnData) : []}
              totalValue={computedTxnData ? computedTxnData[0].total / 100 : 0}
              showAddAccountButton
              loading={txnPending || txnStale}
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
