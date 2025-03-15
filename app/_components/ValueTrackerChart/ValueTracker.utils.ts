import { LineChartDataPoint } from '../../_models/ChartData';
import { TransactionData } from '../../_models/TransactionData';
import { formatDate } from '../../_utils/utils';

// export const sortByDate = (
//   data: LineChartDataPoint[],
//   range: TransactionRange,
// ) => {
//   const now = new Date();
//   const msInDay = 24 * 60 * 60 * 1000;

//   return data
//     .filter((point) => {
//       const pointDate = new Date(point.date);
//       const daysDifference = (now.getTime() - pointDate.getTime()) / msInDay;

//       if (range === 'week') {
//         return daysDifference <= 7;
//       }
//       if (range === 'month') {
//         return daysDifference <= 30;
//       }
//       if (range === 'threeMonth') {
//         return daysDifference <= 90;
//       }
//       if (range === 'sixMonth') {
//         return true;
//       }
//       return false;
//     })
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//     .map((point) => ({
//       ...point,
//       date: formatDate(new Date(point.date), true),
//     }));
// };

export const formatTransactions = (
  tx: TransactionData[],
  balance: number,
): LineChartDataPoint[] => {
  const dailyAmounts: Record<string, number> = {};

  const sortedTx = [...tx].sort((a, b) => b.transacted_at - a.transacted_at);

  let runningTotal = balance;
  sortedTx.forEach(({ amount, transacted_at }) => {
    const date = new Date(transacted_at * 1000);
    const dateKey = date.toISOString().split('T')[0];

    runningTotal -= amount / 100;

    dailyAmounts[dateKey] = runningTotal;
  });

  const today = new Date().toISOString().split('T')[0];
  if (!dailyAmounts[today]) {
    dailyAmounts[today] = balance;
  }

  return Object.entries(dailyAmounts)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => ({
      date: date,
      amount: amount,
    }));
};

export const getRandomLoadingQuote = (): string => {
  const quotes = [
    "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it. - Albert Einstein",
    'The best time to start saving was 20 years ago. The second best time is now.',
    'A budget is telling your money where to go instead of wondering where it went.',
    'Did you know? The 50/30/20 rule suggests spending 50% on needs, 30% on wants, and 20% on savings.',
    'Financial freedom is available to those who learn about it and work for it. - Robert Kiyosaki',
    "Fun fact: If you saved $5 a day for a year with 7% returns, you'd have over $1,900 after 10 years.",
    'The stock market is a device for transferring money from the impatient to the patient. - Warren Buffett',
    'Pro tip: Paying yourself first means putting money into savings before discretionary spending.',
    'The price of anything is the amount of life you exchange for it. - Henry David Thoreau',
    'Did you know? The average millionaire has 7 different streams of income.',
    'Investing in low-cost index funds has historically outperformed 80% of actively managed funds.',
    "Every dollar you don't spend today is a dollar plus interest you'll have tomorrow.",
    "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make. - Dave Ramsey",
    'Fun fact: The Rule of 72 divides 72 by your interest rate to estimate years needed to double your money.',
    'Beware of little expenses; a small leak will sink a great ship. - Benjamin Franklin',
    'Pro tip: Automating your savings and investments removes the temptation to spend that money.',
    "It's not how much money you make, but how much money you keep. - Robert Kiyosaki",
    'The habit of saving is itself an education; it fosters every virtue, teaches self-denial, and shows the value of money. - T.T. Munger',
    'Did you know? The average American spends about $5,400 per year on impulse purchases.',
    'Wealth consists not in having great possessions, but in having few wants. - Epictetus',
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const sortByDateByRange = (data: LineChartDataPoint[]) => {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;

  // Helper function to process data for a specific range
  const processDataForRange = (filteredData: LineChartDataPoint[]) => {
    return filteredData
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((point) => ({
        ...point,
        date: formatDate(new Date(point.date), true),
      }));
  };

  // Filter data for each range
  const weekData = data.filter((point) => {
    const pointDate = new Date(point.date);
    const daysDifference = (now.getTime() - pointDate.getTime()) / msInDay;
    return daysDifference <= 7;
  });

  const monthData = data.filter((point) => {
    const pointDate = new Date(point.date);
    const daysDifference = (now.getTime() - pointDate.getTime()) / msInDay;
    return daysDifference <= 30;
  });

  const threeMonthData = data.filter((point) => {
    const pointDate = new Date(point.date);
    const daysDifference = (now.getTime() - pointDate.getTime()) / msInDay;
    return daysDifference <= 90;
  });

  // For sixMonth, we include all data points
  const sixMonthData = [...data];

  // Return an object with processed data for each range
  return {
    week: processDataForRange(weekData),
    month: processDataForRange(monthData),
    threeMonth: processDataForRange(threeMonthData),
    sixMonth: processDataForRange(sixMonthData),
  };
};
