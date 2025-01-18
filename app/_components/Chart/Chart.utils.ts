import {
  ChartDataPoint,
  ChartType,
  LineChartDataPoint,
  PieChartDataPoint,
} from '../../_models/ChartData';

const hydrateColors = (data: Omit<PieChartDataPoint, 'color'>[]) => {
  return data.map((item, i) => ({ ...item, color: `green.${i + 1}` }));
};

export const getDomain = (data: LineChartDataPoint[]) => {
  return [data[0].amount, data[data.length - 1].amount];
};

export const formatData = (data: ChartDataPoint[], type: ChartType) => {
  if (type === 'line' || type === 'bar') {
    console.log(data);
    return data.map((item) => ({ amount: item.amount, date: item.label }));
  } else {
    return hydrateColors(
      data.map((item) => ({ value: item.amount, name: item.label })),
    );
  }
};

export const formatCurrency = (amount: number): string => {
  return `$${Number(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
