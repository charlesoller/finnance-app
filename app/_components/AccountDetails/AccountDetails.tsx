'use client';

import { Button, Flex, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Nav from '../Nav/Nav';
import { useDisclosure } from '@mantine/hooks';
import { useModalStore } from '../../_stores/ModalStore';
import { CONFIRM_DISCONNECT_MODAL } from '../_modals';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { useAccountData } from '../../_utils/_hooks/useAccountData';
import TransactionViewer from '../TransactionViewer/TransactionViewer';
import { useTransactions } from '../TransactionViewer/TransactionViewer.hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import { useMemo } from 'react';

export default function AccountDetails() {
  const { accountId } = useParams();
  const { openModal } = useModalStore();
  const { handleSelectTxn, selectedTransactionIds, isActiveTxnId } =
    useChatContextStore();

  const [opened, { toggle }] = useDisclosure();

  const { accountData: account, loading: accountLoading } = useAccountData(
    accountId as string,
  );
  const { transactions, isLoading: txnLoading } = useTransactions();

  const balance = useMemo(() => {
    const bal =
      account?.balance?.cash?.available?.usd ||
      account?.balance?.credit?.used?.usd ||
      account?.balance?.current?.usd;

    return bal ? bal / 100 : undefined;
  }, [account]);

  const isInactive =
    account?.status === 'inactive' && !transactions?.length && !txnLoading;

  console.log('TX: ', transactions);
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
            {accountLoading
              ? 'Loading...'
              : `${account?.institution_name} ${account?.display_name}${!!account?.last4 ? ` (...${account?.last4})` : ''}`}
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
        {isInactive && (
          <Text c="red" size="xl" ml="sm">
            Unable to get transactions for inactive account.
          </Text>
        )}
        <ValueTrackerChart
          loading={!account}
          totalValue={balance}
          totalValueLabel="Current Balance"
          accountIds={[accountId as string]}
        />
        <TransactionViewer
          onTransactionSelect={handleSelect}
          accountIds={[accountId as string]}
        />
      </>
    </SlideDrawer>
  );
}
