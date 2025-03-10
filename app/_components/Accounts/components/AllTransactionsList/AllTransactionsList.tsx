import {
  ActionIcon,
  Flex,
  Loader,
  Pagination,
  Paper,
  SegmentedControl,
  Tooltip,
} from '@mantine/core';
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
import RecurringTransactions from '../../../RecurringTransactions/RecurringTransactions';
import { IconRotateClockwise2 } from '@tabler/icons-react';

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

  return (
    <Flex direction="column">
      <Paper withBorder p="sm" my="sm">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="md">
            <Tooltip label="View your recurring charges">
              <ActionIcon
                radius="xl"
                color="green"
                variant={viewRecurring ? 'filled' : 'outline'}
                onClick={() => setViewRecurring((prev) => !prev)}
                size="lg"
              >
                <IconRotateClockwise2 />
              </ActionIcon>
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
          </Flex>
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
      </Paper>
      {isLoading && <Loader color="green" m="auto" />}
      {!!transactions && !viewRecurring && (
        <TransactionList
          transactions={paginatedTxns[page - 1]}
          onSelect={onSelect}
        />
      )}
      {!!transactions && viewRecurring && (
        <RecurringTransactions onSelect={onSelect} />
      )}
    </Flex>
  );
}
