'use client';

import '@mantine/charts/styles.css';
import { BarChart, LineChart, PieChart, PieChartCell } from '@mantine/charts';
import Message from '../Message/Message';
import {
  ChartDataPoint,
  ChartType,
  LineChartDataPoint,
} from '../../_models/ChartData';
import { formatData, getDomain } from './Chart.utils';

interface ChartProps {
  type: ChartType;
  data: ChartDataPoint[];
}

export default function Chart({ type, data }: ChartProps) {
  const getChart = () => {
    const formattedData = formatData(data, type);

    if (type === 'line')
      return (
        <LineChart
          h={300}
          data={formattedData}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6' }]}
          curveType="linear"
          yAxisProps={{
            domain: getDomain(formattedData as LineChartDataPoint[]),
          }}
        />
      );

    if (type === 'bar')
      return (
        <BarChart
          h={300}
          data={formattedData}
          dataKey="date"
          series={[{ name: 'amount', color: 'green.6' }]}
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
        />
      );
  };

  return (
    <Message isGraph fitContent={type === 'pie'}>
      {getChart()}
    </Message>
  );
}
