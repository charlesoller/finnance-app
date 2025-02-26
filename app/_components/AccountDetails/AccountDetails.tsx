'use client';

import { Button, Divider, Flex, Loader, Text, Title } from '@mantine/core';
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
  ACCOUNT_KEY,
  TRANSACTION_KEY,
} from '../../_utils/_hooks/_mutations/queryKeys';
import { AccountData } from '../../_models/AccountData';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';

export default function AccountDetails() {
  const { accountId } = useParams();
  const { token } = useUserStore();
  const { openModal } = useModalStore();
  const { handleSelectTxn, selectedTransactionIds, isActiveTxnId } =
    useChatContextStore();

  const [opened, { toggle }] = useDisclosure();

  const {
    error: accountError,
    data: account,
    isLoading: accountLoading,
    isPending: accountPending,
  } = useQuery<AccountData>({
    queryKey: [ACCOUNT_KEY, accountId],
    queryFn: () => stripeAPI.getAccountById(accountId as string, token),
    refetchOnWindowFocus: false,
    enabled: !!accountId && !!token,
  });

  const {
    error: transactionsError,
    data: transactions,
    isLoading: transactionsLoading,
    isPending: transactionsPending,
  } = useQuery<any>({
    queryKey: [TRANSACTION_KEY, accountId],
    queryFn: () => stripeAPI.getTransactions(accountId as string, token),
    refetchOnWindowFocus: false,
    enabled: !!accountId && !!token && account?.status !== 'inactive',
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
            {accountLoading || accountPending
              ? 'Loading...'
              : `${account?.display_name} (...${account?.last4})`}
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
        {!transactionsLoading &&
          !transactionsPending &&
          !transactionsError &&
          !transactions?.length && <Text>No data found</Text>}
        {!!transactions?.length && (
          <>
            <AccountSummary transactions={transactions} />
            <Divider label="Transactions" labelPosition="left" my="xs" />
            <TransactionList onSelect={handleSelect} />
          </>
        )}
      </>
    </SlideDrawer>
  );
}
