export type ChartType = 'line' | 'bar' | 'pie';

export interface ChartDataPoint {
  label: string;
  amount: number;
}

export interface LineChartDataPoint {
  date: string;
  amount: number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface GraphResponse {
  type: ChartType;
  data: ChartDataPoint[];
}
