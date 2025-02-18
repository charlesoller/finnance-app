import { LineChart } from '@mantine/charts';
import { Flex, Paper, SegmentedControl } from '@mantine/core';
import { LineChartDataPoint } from '../../_models/ChartData';
import { getDomain } from '../Chart/Chart.utils';
import { formatCurrency } from '../../_utils/utils';
import { useMemo, useState } from 'react';
import { ValueTrackerDateRange } from './ValueTracker.types';
import { sortByDate } from './ValueTracker.utils';

interface ValueTrackerChartProps {
  data: LineChartDataPoint[];
  defaultRange?: ValueTrackerDateRange;
}

export default function ValueTrackerChart({
  data,
  defaultRange = 'week',
}: ValueTrackerChartProps) {
  const [range, setRange] = useState<ValueTrackerDateRange>(defaultRange);

  const selectedData = useMemo(() => {
    return sortByDate(data, range);
  }, [data, range]);

  return (
    <Paper shadow="md" withBorder p="lg" radius="lg">
      <Flex direction="column" gap="xl">
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
      </Flex>
    </Paper>
  );
}
