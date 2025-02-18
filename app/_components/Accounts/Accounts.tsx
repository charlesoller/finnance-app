'use client';

import { Divider } from '@mantine/core';
import AccountsList from './components/AccountList/AccountsList';
import AccountsButtons from './components/AccountsButtons/AccountsButtons';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import { formatNetWorthData } from './Accounts.utils';
import { MOCK_NET_WORTH_DATA } from './Accounts.mock';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';

export default function Accounts() {
  const [opened, { toggle }] = useDisclosure();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    if (!opened) {
      toggle();
    }

    if (selectedAccounts.includes(id)) {
      const filtered = selectedAccounts.filter((acctId) => acctId !== id);
      setSelectedAccounts(filtered);

      if (!filtered.length) {
        toggle();
      }
    } else {
      setSelectedAccounts((prev) => [...prev, id]);
    }
  };

  return (
    <SlideDrawer
      opened={opened}
      side="right"
      drawerComponent={<Chat showHistoryMenu={false} />}
    >
      <>
        <ValueTrackerChart data={formatNetWorthData(MOCK_NET_WORTH_DATA)} />
        <Divider my="xs" label="Actions" labelPosition="left" />
        <AccountsButtons onToggle={toggle} />
        <AccountsList
          selectedAccounts={selectedAccounts}
          onSelect={handleSelect}
        />
      </>
    </SlideDrawer>
  );
}
