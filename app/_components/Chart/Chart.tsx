'use client';

import '@mantine/charts/styles.css';
import { BarChart, LineChart, PieChart, PieChartCell } from '@mantine/charts';
import Message from '../Message/Message';
import {
  ChartDataPoint,
  ChartType,
  LineChartDataPoint,
} from '../../_models/ChartData';
import { formatCurrency, formatData, getDomain } from './Chart.utils';

interface ChartProps {
  type: ChartType;
  data: ChartDataPoint[];
}

export default function Chart({ type, data }: ChartProps) {
  if (!data || !type) return null;
  const getChart = () => {
    const formattedData = formatData(data, type);

    if (type === 'line')
      return (
        <LineChart
          h={300}
          data={formattedData}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6', label: 'Amount' }]}
          curveType="linear"
          yAxisProps={{
            domain: getDomain(formattedData as LineChartDataPoint[]),
          }}
          valueFormatter={(val) => formatCurrency(val)}
        />
      );

    if (type === 'bar')
      return (
        <BarChart
          h={300}
          data={formattedData}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6', label: 'Amount' }]}
          valueFormatter={(val) => formatCurrency(val)}
        />
      );

    if (type === 'pie')
      return (
        <PieChart
          h={300}
          data={formattedData as PieChartCell[]}
          withLabels
          withLabelsLine={false}
          withTooltip
          tooltipDataSource="segment"
          // valueFormatter={(val) => formatCurrency(val)}
        />
      );
  };

  return (
    <Message isGraph fitContent={type === 'pie'}>
      {getChart()}
    </Message>
  );
}
