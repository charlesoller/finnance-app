import {
  Button,
  Divider,
  Flex,
  Loader,
  Pagination,
  SegmentedControl,
  Tooltip,
} from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { getRecurringCharges } from '../../Accounts.utils';

interface AllTransactionsListProps {
  onSelect: (id: string) => void;
}

const PAGE_LENGTH = 20;

export default function AllTransactionsList({
  onSelect,
}: AllTransactionsListProps) {
  const { token, customerId } = useUserStore();
  const [range, setRange] = useState<TransactionRange>('week');
  const [page, setPage] = useState<number>(1);
  const [viewRecurring, setViewRecurring] = useState<boolean>(false);
  const queryClient = useQueryClient();

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

  const paginatedTxns = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const result: TransactionData[][] = [];
    for (let i = 0; i < transactions.length; i += PAGE_LENGTH) {
      result.push(transactions.slice(i, i + PAGE_LENGTH));
    }
    return result;
  }, [transactions]);

  const getPaginationTotal = () => {
    if (!transactions) return 0;
    return Math.ceil(transactions.length / PAGE_LENGTH);
  };

  const handleRangeChange = (v: TransactionRange) => {
    setRange(v as TransactionRange);
    setPage(1);
  };

  const handleViewRecurring = () => {
    // Get the data from the query cache for 'sixMonth' range
    const sixMonthData = queryClient.getQueryData<TransactionData[]>([
      ACCOUNT_TRANSACTIONS_KEY,
      'sixMonth',
    ]);

    // If the data exists in cache, use it; otherwise fetch it
    if (sixMonthData) {
      const recurringCharges = getRecurringCharges(sixMonthData);
      // Do something with the recurring charges
      console.log('Recurring charges:', recurringCharges);
    } else {
      // Optionally fetch the data if not in cache
      queryClient
        .fetchQuery({
          queryKey: [ACCOUNT_TRANSACTIONS_KEY, 'sixMonth'],
          queryFn: () =>
            stripeAPI.getCustomerTransactionData(
              { customerId, range: 'sixMonth' },
              token,
            ),
        })
        .then((data) => {
          if (data) {
            const recurringCharges = getRecurringCharges(
              data as TransactionData[],
            );
            // Do something with the recurring charges
            console.log('Recurring charges:', recurringCharges);
          }
        });
    }
  };

  return (
    <Flex direction="column">
      <Divider mb="md" label="Filters" labelPosition="left" />
      <Flex gap="md" align="center">
        <Tooltip label="View your recurring charges">
          <Button
            radius="md"
            color="green"
            variant={viewRecurring ? 'filled' : 'outline'}
            onClick={() => {
              setViewRecurring((prev) => !prev);
              handleViewRecurring();
            }}
          >
            View Recurring
          </Button>
        </Tooltip>
        <Tooltip
          disabled={!viewRecurring}
          label="Date range is disabled while viewing recurring charges"
        >
          <SegmentedControl
            disabled={viewRecurring}
            value={range}
            data={[
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
              { label: '3 Month', value: 'threeMonth' },
              { label: '6 Month', value: 'sixMonth' },
            ]}
            onChange={(v) => handleRangeChange(v as TransactionRange)}
          />
        </Tooltip>
        <Tooltip
          disabled={!viewRecurring}
          label="Pages are disabled while viewing recurring charges"
        >
          <Pagination
            radius="lg"
            value={page}
            onChange={setPage}
            total={getPaginationTotal()}
            color="green"
            siblings={1}
            disabled={!transactions || viewRecurring}
          />
        </Tooltip>
      </Flex>
      {isLoading && <Loader color="green" m="auto" />}
      {!!transactions && (
        <TransactionList
          transactions={paginatedTxns[page - 1]}
          onSelect={onSelect}
        />
      )}
    </Flex>
  );
}
