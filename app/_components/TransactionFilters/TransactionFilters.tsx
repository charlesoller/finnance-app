import {
  ActionIcon,
  Flex,
  Pagination,
  Paper,
  SegmentedControl,
  Tooltip,
} from '@mantine/core';
import { IconRotateClockwise2 } from '@tabler/icons-react';
import { TransactionRange } from '../../_models/TransactionData';

interface TransactionFiltersProps {
  viewRecurring: boolean;
  onViewRecurringClick: () => void;
  range: TransactionRange;
  rangeOnChange: (range: TransactionRange) => void;
  disabled: boolean;
  page: number;
  pageOnChange: (val: number) => void;
  paginationTotal: number;
}

export default function TransactionFilters({
  viewRecurring,
  onViewRecurringClick,
  range,
  rangeOnChange,
  disabled,
  page,
  pageOnChange,
  paginationTotal,
}: TransactionFiltersProps) {
  return (
    <Paper withBorder p="sm" my="sm">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap="md">
          <Tooltip label="View your recurring charges">
            <ActionIcon
              radius="xl"
              color="green"
              variant={viewRecurring ? 'filled' : 'outline'}
              onClick={onViewRecurringClick}
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
              onChange={(v) => rangeOnChange(v as TransactionRange)}
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
            onChange={pageOnChange}
            total={paginationTotal}
            color="green"
            siblings={1}
            disabled={disabled || viewRecurring}
          />
        </Tooltip>
      </Flex>
    </Paper>
  );
}
