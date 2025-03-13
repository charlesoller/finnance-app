'use client';

import { LineChart } from '@mantine/charts';
import {
  Center,
  Flex,
  Loader,
  LoadingOverlay,
  NumberFormatter,
  Paper,
  SegmentedControl,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { LineChartDataPoint } from '../../_models/ChartData';
import { formatCurrency } from '../../_utils/utils';
import { useEffect, useMemo, useState } from 'react';
import { formatTransactions, sortByDateByRange } from './ValueTracker.utils';
import AddAccountButton from '../AddAccountButton/AddAccountButton';
import { TransactionRange } from '../../_models/TransactionData';
import { getDomain } from '../Chart/Chart.utils';
import { useRandomLoadingQuote } from '../../_utils/_hooks/useRandomLoadingQuote';
import { useTransactions } from '../TransactionViewer/TransactionViewer.hooks';

interface ValueTrackerChartProps {
  accountIds: string[];
  totalValue?: number;
  onRangeChange?: (range: TransactionRange) => void;
  defaultRange?: TransactionRange;
  showAddAccountButton?: boolean;
  totalValueLabel?: string;
  loading?: boolean;
}

export default function ValueTrackerChart({
  accountIds,
  totalValue,
  onRangeChange,
  defaultRange = 'week',
  showAddAccountButton = false,
  totalValueLabel = 'Net Worth',
  loading = false,
}: ValueTrackerChartProps) {
  const loadingQuote = useRandomLoadingQuote();

  const [range, setRange] = useState<TransactionRange>(defaultRange);

  const { transactions, isPending, isLoading } = useTransactions(
    'sixMonth',
    accountIds,
  );

  const formattedTransactions = useMemo<
    Record<TransactionRange, LineChartDataPoint[]>
  >(() => {
    if (!transactions || !totalValue)
      return {
        week: [],
        month: [],
        threeMonth: [],
        sixMonth: [],
      };

    const formatted = formatTransactions(transactions, totalValue);
    const sorted = sortByDateByRange(formatted);
    return sorted;
  }, [transactions, totalValue]);

  useEffect(() => {
    if (Object.values(formattedTransactions).every((arr) => !arr.length))
      return;

    if (
      !formattedTransactions.week.length ||
      formattedTransactions.week.length < 3
    ) {
      setRange('month');
      return;
    }
    if (
      !formattedTransactions.month.length ||
      formattedTransactions.month.length < 3
    ) {
      setRange('threeMonth');
      return;
    }
    if (
      !formattedTransactions.threeMonth.length ||
      formattedTransactions.threeMonth.length < 3
    ) {
      setRange('sixMonth');
      return;
    }
  }, [formattedTransactions]);

  const handleRangeChange = (val: TransactionRange) => {
    onRangeChange?.(val);
    setRange(val);
  };

  const segmentedControlOptions = [
    {
      value: 'week',
      disabled: !formattedTransactions?.week?.length,
      label: (
        <Tooltip
          label="No transaction data"
          disabled={!!formattedTransactions?.week?.length}
        >
          <Center>
            <span>Week</span>
          </Center>
        </Tooltip>
      ),
    },
    {
      value: 'month',
      disabled: !formattedTransactions?.month?.length,
      label: (
        <Tooltip
          label="No transaction data"
          disabled={!!formattedTransactions?.month?.length}
        >
          <Center>
            <span>Month</span>
          </Center>
        </Tooltip>
      ),
    },
    {
      value: 'threeMonth',
      disabled: !formattedTransactions?.threeMonth?.length,
      label: (
        <Tooltip
          label="No transaction data"
          disabled={!!formattedTransactions?.threeMonth?.length}
        >
          <Center>
            <span>3 Month</span>
          </Center>
        </Tooltip>
      ),
    },
    {
      value: 'sixMonth',
      disabled: !formattedTransactions?.sixMonth?.length,
      label: (
        <Tooltip
          label="No transaction data"
          disabled={!!formattedTransactions?.sixMonth?.length}
        >
          <Center>
            <span>6 Month</span>
          </Center>
        </Tooltip>
      ),
    },
  ];

  return (
    <Paper shadow="sm" withBorder p="lg" radius="lg" pos="relative">
      <LoadingOverlay
        visible={isPending || isLoading || loading}
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
              <Text ta="center">{loadingQuote}</Text>
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
          data={formattedTransactions[range] || []}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6', label: 'Amount' }]}
          curveType="linear"
          valueFormatter={(val) => formatCurrency(val)}
          yAxisProps={{
            domain: getDomain(
              formattedTransactions[range] as LineChartDataPoint[],
            ),
          }}
          xAxisProps={{
            tickCount: 15,
          }}
        />
        <SegmentedControl
          value={range}
          data={segmentedControlOptions}
          onChange={(v) => handleRangeChange(v as TransactionRange)}
        />
      </Flex>
    </Paper>
  );
}
