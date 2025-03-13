'use client';

import AccountsList from './components/AccountList/AccountsList';
import { useDisclosure } from '@mantine/hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { getCurrentTotal } from './Accounts.utils';
import { useUserStore } from '../../_stores/UserStore';
import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../_services/StripeAPI';
import { ACCOUNT_KEY } from '../../_utils/_hooks/_mutations/queryKeys';
import { FeedDisplay } from './Accounts.types';
import { useMemo, useState } from 'react';
import { Flex, SegmentedControl } from '@mantine/core';
import { AccountData } from '../../_models/AccountData';
import TransactionViewer from '../TransactionViewer/TransactionViewer';
import { useTransactions } from '../TransactionViewer/TransactionViewer.hooks';

export default function Accounts() {
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

  const { transactions: txns } = useTransactions();

  console.log('Accts: ', accts);
  console.log('TXNS: ', txns);

  const trackedAccounts = useMemo(() => {
    if (!accts) return [];
    return accts.filter((acct) => !omittedAccounts.includes(acct.id));
  }, [accts, omittedAccounts]);

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
          <ValueTrackerChart
            totalValue={accts ? getCurrentTotal(trackedAccounts) : 0}
            showAddAccountButton
            accountIds={trackedAccounts.map((acct) => acct.id)}
            loading={!accts}
          />
          <SegmentedControl
            value={feedDisplay}
            data={[
              { label: 'Accounts', value: 'accounts' },
              { label: 'Transactions', value: 'transactions' },
            ]}
            onChange={(v) => setFeedDisplay(v as FeedDisplay)}
            disabled={!accts || !txns}
          />
          {feedDisplay === 'accounts' && (
            <AccountsList onSelect={handleSelectAccount} />
          )}
          {feedDisplay === 'transactions' && (
            <TransactionViewer onTransactionSelect={handleSelectTransaction} />
          )}
        </Flex>
      </>
    </SlideDrawer>
  );
}
