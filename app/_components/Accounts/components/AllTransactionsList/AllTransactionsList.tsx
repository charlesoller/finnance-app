import { Divider, Flex, Loader, SegmentedControl } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ACCOUNT_TRANSACTIONS_KEY } from '../../../../_utils/_hooks/_mutations/queryKeys';
import stripeAPI from '../../../../_services/StripeAPI';
import { useUserStore } from '../../../../_stores/UserStore';
import TransactionList from '../../../AccountDetails/components/TransactionList';
import {
  TransactionData,
  TransactionDataRequest,
  TransactionRange,
} from '../../../../_models/TransactionData';

interface AllTransactionsListProps {
  onSelect: (id: string) => void;
}
export default function AllTransactionsList({
  onSelect,
}: AllTransactionsListProps) {
  const { token, customerId } = useUserStore();
  const [range, setRange] = useState<TransactionRange>('week');

  const request: TransactionDataRequest = useMemo(
    () => ({
      customerId,
      range,
    }),
    [customerId, range],
  );

  const {
    error,
    data: transactions,
    isLoading,
    isPending,
  } = useQuery<TransactionData[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_KEY, range],
    queryFn: () => stripeAPI.getCustomerTransactionData(request, token),
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!token,
  });

  return (
    <Flex direction="column">
      <Divider mb="md" label="Date Range" labelPosition="left" />
      <Flex gap="md">
        {/* <Button
          color="green"
          radius="xl"
          variant={isThisWeek ? 'filled' : 'outline'}
          onClick={() => setIsThisWeek(prev => !prev)}
        >
          This Week
        </Button>
        <Tooltip label="Example text here" disabled={!isThisWeek}>
          <Pagination 
            radius='lg'
            value={page}
            onChange={setPage}
            total={20}
            color="green"
            disabled={isThisWeek}
          />
        </Tooltip> */}
        <SegmentedControl
          value={range}
          data={[
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
            { label: 'All', value: 'all' },
          ]}
          onChange={(v) => setRange(v as TransactionRange)}
        />
      </Flex>
      {isLoading && <Loader color="green" m="auto" />}
      {!!transactions && (
        <TransactionList transactions={transactions} onSelect={onSelect} />
      )}
    </Flex>
  );
}
