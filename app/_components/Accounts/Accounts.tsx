import { Flex } from '@mantine/core';
import AccountsList from './components/AccountList/AccountsList';
import AccountsHeader from './components/AccountsHeader/AccountsHeader';
import Chart from '../Chart/Chart';
import { ChartDataPoint } from '../../_models/ChartData';

const MOCK: ChartDataPoint[] = [
  {
    label: '09-24-2022',
    amount: 1000,
  },
  {
    label: '09-24-2023',
    amount: 2000,
  },
  {
    label: '09-24-2024',
    amount: 5000,
  },
  {
    label: '09-24-2025',
    amount: 10000,
  },
];

export default function Accounts() {
  return (
    <Flex
      direction="column"
      mah={{ base: '95dvh', fallback: '95vh' }}
      style={{ overflowY: 'auto' }}
      p="md"
    >
      <AccountsHeader />
      <Chart type="line" data={MOCK} />
      <AccountsList />
    </Flex>
  );
}
