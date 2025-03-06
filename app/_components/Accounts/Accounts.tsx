'use client';

import AccountsList from './components/AccountList/AccountsList';
import { useDisclosure } from '@mantine/hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import { MOCK_NET_WORTH_DATA } from './Accounts.mock';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { formatNetWorthData } from './Accounts.utils';

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
        <ValueTrackerChart
          data={formatNetWorthData(MOCK_NET_WORTH_DATA)}
          totalValue={MOCK_NET_WORTH_DATA[MOCK_NET_WORTH_DATA.length - 1].total}
          showAddAccountButton
        />
        {/* <AccountsButtons onToggle={toggle} /> */}
        <AccountsList onSelect={handleSelect} />
      </>
    </SlideDrawer>
  );
}
