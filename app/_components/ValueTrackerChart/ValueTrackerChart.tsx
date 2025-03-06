import { LineChart } from '@mantine/charts';
import {
  Flex,
  LoadingOverlay,
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
import AddAccountButton from '../AddAccountButton/AddAccountButton';

interface ValueTrackerChartProps {
  data: LineChartDataPoint[];
  totalValue: number;
  defaultRange?: ValueTrackerDateRange;
  showAddAccountButton?: boolean;
  totalValueLabel?: string;
  loading?: boolean;
}

export default function ValueTrackerChart({
  data,
  totalValue,
  defaultRange = 'week',
  showAddAccountButton = false,
  totalValueLabel = 'Net Worth',
  loading = false,
}: ValueTrackerChartProps) {
  const [range, setRange] = useState<ValueTrackerDateRange>(defaultRange);

  const selectedData = useMemo(() => {
    return sortByDate(data, range);
  }, [data, range]);

  return (
    <Paper shadow="sm" withBorder p="lg" radius="lg" pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'green' }}
      />
      <Flex direction="column" gap="xl">
        <Flex justify="space-between">
          <Flex direction="column" px="md">
            <Text>{totalValueLabel}</Text>
            <Title>
              <NumberFormatter
                prefix="$"
                value={totalValue}
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
              />
            </Title>
          </Flex>
          {showAddAccountButton && <AddAccountButton />}
        </Flex>
        <LineChart
          h={300}
          maw="95%"
          mx="auto"
          data={selectedData}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6', label: 'Amount' }]}
          curveType="linear"
          valueFormatter={(val) => formatCurrency(val)}
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
