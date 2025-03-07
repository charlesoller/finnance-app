'use client';

import AccountsList from './components/AccountList/AccountsList';
import { useDisclosure } from '@mantine/hooks';
import ValueTrackerChart from '../ValueTrackerChart/ValueTrackerChart';
import { NetWorthData } from './Accounts.mock';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import Chat from '../Chat/Chat';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { formatNetWorthData } from './Accounts.utils';
import { useCustomerInfo } from '../../_utils/_hooks/useCustomerInfo';
import { useUserStore } from '../../_stores/UserStore';
import { useQuery } from '@tanstack/react-query';
import stripeAPI from '../../_services/StripeAPI';
import { ACCOUNT_TRANSACTIONS_KEY } from '../../_utils/_hooks/_mutations/queryKeys';

export default function Accounts() {
  useCustomerInfo();

  const [opened, { toggle }] = useDisclosure();

  const {
    handleSelectAcct,
    selectedAccountIds,
    isActiveAcctId,
    omittedAccounts,
  } = useChatContextStore();

  const { token, customerId } = useUserStore();

  const {
    error,
    data: accountTxnData,
    isFetching,
    isPending,
  } = useQuery<NetWorthData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY],
    queryFn: () =>
      stripeAPI.getCustomerTransactionData(customerId, omittedAccounts, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });

  console.log('ACCOUNT TXN DATA: ', accountTxnData);

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
        {(!!accountTxnData?.length || isFetching || isPending) && (
          <ValueTrackerChart
            data={accountTxnData ? formatNetWorthData(accountTxnData) : []}
            totalValue={accountTxnData ? accountTxnData?.[0]?.total / 100 : 0}
            showAddAccountButton
            loading={isPending || isFetching}
          />
        )}
        <AccountsList onSelect={handleSelect} />
      </>
    </SlideDrawer>
  );
}
