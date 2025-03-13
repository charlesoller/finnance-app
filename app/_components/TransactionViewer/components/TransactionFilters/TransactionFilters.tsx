import {
  Button,
  Flex,
  LoadingOverlay,
  Pagination,
  Paper,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { TransactionRange } from '../../../../_models/TransactionData';

interface TransactionFiltersProps {
  viewRecurring: boolean;
  onViewRecurringClick: () => void;
  range: TransactionRange;
  rangeOnChange: (range: TransactionRange) => void;
  disabled: boolean;
  page: number;
  pages: number;
  pageOnChange: (val: number) => void;
  filter: string;
  onFilter: (query: string) => void;
  loading?: boolean;
}

export default function TransactionFilters({
  viewRecurring,
  onViewRecurringClick,
  range,
  rangeOnChange,
  disabled,
  page,
  pages,
  pageOnChange,
  filter,
  onFilter,
  loading = false,
}: TransactionFiltersProps) {
  return (
    <Paper withBorder p="sm" my="lg" pos="relative" shadow="sm" radius="md">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'green' }}
      />
      <Flex align="center" justify="space-between">
        <Flex align="center" gap="md">
          {/* <Tooltip label="View your recurring charges">
            <ActionIcon
              radius="xl"
              color="green"
              variant={viewRecurring ? 'filled' : 'outline'}
              onClick={onViewRecurringClick}
              size="lg"
            >
              <IconRotateClockwise2 />
            </ActionIcon>
          </Tooltip> */}
          {/* <Tooltip
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
          </Tooltip> */}
          <Tooltip
            label="Disabled while viewing recurring"
            disabled={!viewRecurring}
          >
            <TextInput
              placeholder="Transaction Name"
              rightSection={<IconSearch size={16} />}
              miw={300}
              value={filter}
              onChange={(e) => onFilter(e.target.value)}
              disabled={viewRecurring}
            />
          </Tooltip>
          <Tooltip label="Disabled while searching" disabled={!filter.length}>
            <Button
              radius="md"
              color="green"
              variant={viewRecurring ? 'filled' : 'outline'}
              onClick={onViewRecurringClick}
              size="sm"
              disabled={!!filter.length}
            >
              View Recurring
            </Button>
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
            total={pages}
            color="green"
            siblings={1}
            disabled={disabled || viewRecurring}
          />
        </Tooltip>
      </Flex>
    </Paper>
  );
}
