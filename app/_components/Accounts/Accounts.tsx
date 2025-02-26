'use client';

import { Divider } from '@mantine/core';
import AccountsList from './components/AccountList/AccountsList';
import AccountsButtons from './components/AccountsButtons/AccountsButtons';
import { useDisclosure } from '@mantine/hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import { formatNetWorthData } from './Accounts.utils';
import { MOCK_NET_WORTH_DATA } from './Accounts.mock';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';

export default function Accounts() {
  const [opened, { toggle }] = useDisclosure();
  const { handleSelectAcct, selectedAccountIds, isActiveAcctId } =
    useChatContextStore();

  const handleSelect = (id: string) => {
    if (!opened) {
      toggle();
    }

    if (isActiveAcctId(id) && selectedAccountIds.length === 1) {
      toggle();
    }

    handleSelectAcct(id);
  };

  return (
    <SlideDrawer
      opened={opened}
      side="right"
      drawerComponent={<Chat showHistoryMenu={false} />}
    >
      <>
        <ValueTrackerChart data={formatNetWorthData(MOCK_NET_WORTH_DATA)} />
        <Divider my="xs" mt="lg" label="Actions" labelPosition="left" />
        <AccountsButtons onToggle={toggle} />
        <AccountsList onSelect={handleSelect} />
      </>
    </SlideDrawer>
  );
}
