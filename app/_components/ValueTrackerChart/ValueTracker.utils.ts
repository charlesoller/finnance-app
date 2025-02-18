import { LineChartDataPoint } from '../../_models/ChartData';
import { formatDate } from '../../_utils/utils';
import { ValueTrackerDateRange } from './ValueTracker.types';

export const sortByDate = (
  data: LineChartDataPoint[],
  range: ValueTrackerDateRange,
) => {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;

  return data
    .filter((point) => {
      const pointDate = new Date(point.date);
      const daysDifference = (now.getTime() - pointDate.getTime()) / msInDay;

      if (range === 'week') {
        return daysDifference <= 7;
      }
      if (range === 'month') {
        return daysDifference <= 30;
      }
      if (range === 'year') {
        return daysDifference <= 365;
      }
      if (range === 'all') {
        return true;
      }
      return false;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((point) => ({
      ...point,
      date: formatDate(new Date(point.date), true),
    }));
};
