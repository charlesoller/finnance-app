import { LineChartDataPoint } from '../../_models/ChartData';
import { TransactionData } from '../../_models/TransactionData';
import { cleanDateString, formatDate } from '../../_utils/utils';
import { groupTransactionsByDate } from '../TransactionViewer/TransactionViewer.utils';

export const formatTransactions = (
  tx: TransactionData[],
  balance: number,
): LineChartDataPoint[] => {
  const dailyAmounts: Record<string, number> = {};

  const groupedTx = groupTransactionsByDate(tx);
  const sortedDates = Object.keys(groupedTx).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateB - dateA; // For descending order (most recent first)
  });
  const todaysDate = new Date();
  const today = formatDate(todaysDate);

  if (sortedDates[0] !== today) {
    sortedDates.unshift(today);
  }

  sortedDates.forEach((date, i) => {
    const getYesterdayBal = () => {
      if (i === 0) {
        return balance;
      } else {
        const prevDate = sortedDates[i - 1];
        return dailyAmounts[prevDate];
      }
    };

    const yesterdayBal = getYesterdayBal();
    const todaysTxns = groupedTx[date] || [];
    const dayTotal = todaysTxns.reduce((acc, curr) => {
      return acc - curr.amount / 100;
    }, yesterdayBal);

    dailyAmounts[date] = dayTotal;
  });

  return Object.entries(dailyAmounts)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => ({
      date: cleanDateString(date),
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
    console.log('ARGS: ', filteredData);
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
