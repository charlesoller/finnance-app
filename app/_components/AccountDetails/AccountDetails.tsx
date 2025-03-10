'use client';

import { Button, Flex, Loader, Text, Title } from '@mantine/core';
import { useUserStore } from '../../_stores/UserStore';
import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../_services/StripeAPI';
import { useParams } from 'next/navigation';
import AccountSummary from './components/AccountSummary';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Nav from '../Nav/Nav';
import TransactionList from './components/TransactionList';
import { useDisclosure } from '@mantine/hooks';
import { useModalStore } from '../../_stores/ModalStore';
import { CONFIRM_DISCONNECT_MODAL } from '../_modals';
import {
  ACCOUNT_TRANSACTIONS_KEY,
} from '../../_utils/_hooks/_mutations/queryKeys';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { useCustomerInfo } from '../../_utils/_hooks/useCustomerInfo';
import { useMemo, useState } from 'react';
import {
  TransactionData,
  TransactionDataRequest,
  TransactionRange,
} from '../../_models/TransactionData';
import { PAGE_LENGTH } from '../Accounts/Accounts.types';
import TransactionFilters from '../TransactionFilters/TransactionFilters';
import RecurringTransactions from '../RecurringTransactions/RecurringTransactions';
import { useAccountData } from '../../_utils/_hooks/useAccountData';

export default function AccountDetails() {
  useCustomerInfo();
  const { accountId } = useParams();
  const { token, customerId } = useUserStore();
  const { openModal } = useModalStore();
  const { handleSelectTxn, selectedTransactionIds, isActiveTxnId } =
    useChatContextStore();

  const [opened, { toggle }] = useDisclosure();
  const [range, setRange] = useState<TransactionRange>('week');
  const [page, setPage] = useState<number>(1);
  const [viewRecurring, setViewRecurring] = useState<boolean>(false);

  // const {
  //   error: accountError,
  //   data: account,
  //   isLoading: accountLoading,
  //   isPending: accountPending,
  // } = useQuery<AccountData>({
  //   queryKey: [ACCOUNT_KEY, accountId],
  //   queryFn: () => stripeAPI.getAccountById(accountId as string, token),
  //   refetchOnWindowFocus: false,
  //   enabled: !!accountId && !!token,
  // });

  const { accountData: account, loading: accountLoading } = useAccountData(
    accountId as string,
  );

  const request: TransactionDataRequest = useMemo(
    () => ({
      customerId,
      range,
    }),
    [customerId, range],
  );

  const {
    error: transactionsError,
    data: transactions,
    isLoading: transactionsLoading,
    isPending: transactionsPending,
  } = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, range],
    queryFn: () => stripeAPI.getCustomerTransactionData(request, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });

  const handleSelect = (id: string) => {
    if (!opened) {
      toggle();
    }

    if (isActiveTxnId(id) && selectedTransactionIds.length === 1) {
      toggle();
    }

    handleSelectTxn(id);
  };

  const handleDisconnect = () => {
    if (!accountId || typeof accountId !== 'string') return;
    openModal(CONFIRM_DISCONNECT_MODAL);
  };

  const filteredAndPaginatedTxns = useMemo(() => {
    if (!transactions || transactions.length === 0 || !accountId) return [];
    const filtered = transactions.filter((txn) => txn.account === accountId);

    const result: TransactionData[][] = [];
    for (let i = 0; i < filtered.length; i += PAGE_LENGTH) {
      result.push(filtered.slice(i, i + PAGE_LENGTH));
    }
    return result;
  }, [transactions, accountId]);

  const getPaginationTotal = () => {
    if (!transactions) return 0;
    const acctTxns = transactions.filter((txn) => txn.account === accountId);
    return Math.ceil(acctTxns.length / PAGE_LENGTH);
  };

  const handleRangeChange = (v: TransactionRange) => {
    setRange(v as TransactionRange);
    setPage(1);
  };

  const handleViewRecurringClick = () => {
    setViewRecurring((prev) => !prev);
  };

  return (
    <SlideDrawer
      side="right"
      opened={opened}
      drawerComponent={<Chat showHistoryMenu={false} />}
    >
      <>
        <Nav
          label="Return"
          leftSection={<ArrowLeftIcon />}
          w="fit-content"
          href="/manage"
        />
        <Flex p="sm" align="flex-end">
          <Title order={1}>
            {accountLoading
              ? 'Loading...'
              : `${account?.institution_name} ${account?.display_name} (...${account?.last4})`}
          </Title>
          <Button
            variant="transparent"
            color="gray"
            size="xs"
            onClick={handleDisconnect}
          >
            <Text c="dimmed">Disconnect</Text>
          </Button>
        </Flex>
        {account?.status === 'inactive' && (
          <Text c="red" size="xl" ml="sm">
            Unable to get transactions for inactive account.
          </Text>
        )}
        {(transactionsLoading || transactionsPending) &&
          account?.status !== 'inactive' && <Loader color="green" />}
        {!!transactionsError && <Text>{transactionsError.message}</Text>}
        {!!transactions?.length && !!account && (
          <>
            <AccountSummary
              balance={account.balance?.current?.usd / 100}
              transactions={transactions}
            />
            <TransactionFilters
              viewRecurring={viewRecurring}
              onViewRecurringClick={handleViewRecurringClick}
              range={range}
              rangeOnChange={handleRangeChange}
              disabled={!transactions}
              page={page}
              pageOnChange={setPage}
              paginationTotal={getPaginationTotal()}
            />
            {!viewRecurring && (
              <TransactionList
                onSelect={handleSelect}
                transactions={filteredAndPaginatedTxns[page - 1]}
                account={account}
              />
            )}
            {viewRecurring && <RecurringTransactions onSelect={handleSelect} />}
          </>
        )}
        {!transactionsLoading &&
          !transactionsPending &&
          !transactions?.length &&
          !transactionsError &&
          account?.status !== 'inactive' && (
            <Text size="xl">
              No transaction data available for this account
            </Text>
          )}
      </>
    </SlideDrawer>
  );
}
