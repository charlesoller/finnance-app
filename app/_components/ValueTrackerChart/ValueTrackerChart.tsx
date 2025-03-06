import { LineChart } from '@mantine/charts';
import {
  Button,
  Flex,
  NumberFormatter,
  Paper,
  SegmentedControl,
  Text,
  Title,
} from '@mantine/core';
import { LineChartDataPoint } from '../../_models/ChartData';
import { getDomain } from '../Chart/Chart.utils';
import { formatCurrency } from '../../_utils/utils';
import { useMemo, useState } from 'react';
import { ValueTrackerDateRange } from './ValueTracker.types';
import { sortByDate } from './ValueTracker.utils';
import { useConnectAccounts } from '../../_utils/_hooks/_mutations/useConnectAccounts';

interface ValueTrackerChartProps {
  data: LineChartDataPoint[];
  totalValue: number;
  defaultRange?: ValueTrackerDateRange;
  showAddAccountButton?: boolean;
  totalValueLabel?: string;
}

export default function ValueTrackerChart({
  data,
  totalValue,
  defaultRange = 'week',
  showAddAccountButton = false,
  totalValueLabel = 'Net Worth',
}: ValueTrackerChartProps) {
  const { mutation: connectAccounts } = useConnectAccounts();
  const [range, setRange] = useState<ValueTrackerDateRange>(defaultRange);

  const handleAuthClick = async () => {
    connectAccounts.mutate();
  };

  const selectedData = useMemo(() => {
    return sortByDate(data, range);
  }, [data, range]);

  return (
    <Paper shadow="sm" withBorder p="lg" radius="lg">
      <Flex direction="column" gap="xl">
        <Flex justify="space-between">
          <Flex direction="column" px="md">
            <Text>{totalValueLabel}</Text>
            <Title>
              <NumberFormatter
                prefix="$"
                value={totalValue}
                thousandSeparator
              />
            </Title>
          </Flex>
          {showAddAccountButton && (
            <Button color="green" radius="md" onClick={handleAuthClick}>
              + Add Account
            </Button>
          )}
        </Flex>
        <LineChart
          h={300}
          maw="95%"
          mx="auto"
          data={selectedData}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6', label: 'Amount' }]}
          curveType="linear"
          valueFormatter={(val) => formatCurrency(val, true)}
          yAxisProps={{
            domain: getDomain(selectedData as LineChartDataPoint[]),
          }}
          xAxisProps={{
            tickCount: 15,
          }}
        />
        <SegmentedControl
          value={range}
          data={[
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
            { label: 'All', value: 'all' },
          ]}
          onChange={(v) => setRange(v as ValueTrackerDateRange)}
        />
      </Flex>
    </Paper>
  );
}
