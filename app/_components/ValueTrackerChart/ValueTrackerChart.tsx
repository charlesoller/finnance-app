'use client';

import { LineChart } from '@mantine/charts';
import {
  Flex,
  Loader,
  LoadingOverlay,
  NumberFormatter,
  Paper,
  SegmentedControl,
  Text,
  Title,
} from '@mantine/core';
import { LineChartDataPoint } from '../../_models/ChartData';
import { formatCurrency } from '../../_utils/utils';
import { useMemo, useState } from 'react';
import { sortByDate } from './ValueTracker.utils';
import AddAccountButton from '../AddAccountButton/AddAccountButton';
import { TransactionRange } from '../../_models/TransactionData';
import { getDomain } from '../Chart/Chart.utils';
import { useRandomLoadingQuote } from '../../_utils/_hooks/useRandomLoadingQuote';

interface ValueTrackerChartProps {
  data: LineChartDataPoint[];
  totalValue: number;
  onRangeChange?: (range: TransactionRange) => void;
  defaultRange?: TransactionRange;
  showAddAccountButton?: boolean;
  totalValueLabel?: string;
  loading?: boolean;
}

export default function ValueTrackerChart({
  data,
  totalValue,
  onRangeChange,
  defaultRange = 'week',
  showAddAccountButton = false,
  totalValueLabel = 'Net Worth',
  loading = false,
}: ValueTrackerChartProps) {
  const loadingQuote = useRandomLoadingQuote();
  const [range, setRange] = useState<TransactionRange>(defaultRange);

  const selectedData = useMemo(() => {
    return sortByDate(data, range);
  }, [data, range]);

  const handleRangeChange = (val: TransactionRange) => {
    onRangeChange?.(val);
    setRange(val);
  };

  return (
    <Paper shadow="sm" withBorder p="lg" radius="lg" pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'lg', blur: 2 }}
        loaderProps={{
          color: 'green',
          children: (
            <Flex
              direction="column"
              justify="center"
              align="center"
              gap="md"
              maw="400px"
            >
              <Loader color="green" />
              <Text>{loadingQuote}</Text>
            </Flex>
          ),
        }}
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
            { label: '3 Month', value: 'threeMonth' },
            { label: '6 Month', value: 'sixMonth' },
          ]}
          onChange={(v) => handleRangeChange(v as TransactionRange)}
        />
      </Flex>
    </Paper>
  );
}
