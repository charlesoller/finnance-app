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
    return data.map((item) => ({
      amount: Number(item.amount),
      date: item.label,
    }));
  } else {
    return hydrateColors(
      data.map((item) => ({ value: Number(item.amount), name: item.label })),
    );
  }
};
