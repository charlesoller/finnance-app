import styles from './BudgetTracker.module.css';

import { BubbleChart, DonutChart, PieChart } from '@mantine/charts';
import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { IconBellRinging, IconCalendarDollar } from '@tabler/icons-react';

const pieData = [
  { name: 'Savings', value: 400, color: 'indigo.6' },
  { name: 'Food', value: 300, color: 'yellow.6' },
  { name: 'Entertainment', value: 300, color: 'teal.6' },
  { name: 'Essentials', value: 200, color: 'gray.6' },
];

const donutData = [
  [
    { name: 'Used', value: 40, color: 'transparent' },
    { name: 'Unused', value: 60, color: 'indigo.6' },
  ],
  [
    { name: 'Used', value: 60, color: 'transparent' },
    { name: 'Unused', value: 40, color: 'yellow.6' },
  ],
  [
    { name: 'Used', value: 20, color: 'transparent' },
    { name: 'Unused', value: 80, color: 'teal.6' },
  ],
  [
    { name: 'Used', value: 35, color: 'transparent' },
    { name: 'Unused', value: 65, color: 'gray.6' },
  ],
];

export const bubbleData = [
  { day: 'Monday', index: 1, value: 150 },
  { day: 'Tuesday', index: 1, value: 166 },
  { day: 'Wednesday', index: 1, value: 170 },
  { day: 'Thursday', index: 1, value: 150 },
  { day: 'Friday', index: 1, value: 200 },
  { day: 'Saturday', index: 1, value: 500 },
  { day: 'Sunday', index: 1, value: 100 },
];

export const data = [
  { hour: '08:00', index: 1, value: 150 },
  { hour: '10:00', index: 1, value: 166 },
  { hour: '12:00', index: 1, value: 170 },
  { hour: '14:00', index: 1, value: 150 },
  { hour: '16:00', index: 1, value: 200 },
  { hour: '18:00', index: 1, value: 400 },
  { hour: '20:00', index: 1, value: 100 },
  { hour: '22:00', index: 1, value: 160 },
];

export default function BudgetTracker() {
  const total = pieData.reduce((acc, curr) => (acc += curr.value), 0);
  const proportions = pieData.map((item) => item.value / total);
  const degrees = proportions.map((proportion) => 360 * proportion);

  const startEnd: number[][] = [];
  let start = 0;
  degrees.forEach((degree) => {
    startEnd.push([start, degree + start]);
    start += degree;
  });

  return (
    <Paper withBorder my="xl" mx="auto" p="md" shadow="sm" w="100%">
      <Flex direction="column" gap="md" maw="100%">
        <Flex px="md" justify="space-between">
          <Title>Your Insights</Title>
          <Flex gap="md">
            <ActionIcon radius="xl" color="green" size="xl" variant="subtle">
              <IconBellRinging />
            </ActionIcon>
            <ActionIcon radius="xl" color="green" size="xl" variant="subtle">
              <IconCalendarDollar />
            </ActionIcon>
          </Flex>
        </Flex>
        <Divider my="xs" />
        <Flex direction="column">
          <Badge color="green" variant="light" ml="md">
            Daily Spends
          </Badge>
          <BubbleChart
            h={70}
            mt="xl"
            data={bubbleData}
            // data={data}
            range={[100, 500]}
            color="green.6"
            // dataKey={{ x: 'hour', y: 'index', z: 'value' }}
            dataKey={{ x: 'day', y: 'index', z: 'value' }}
          />
        </Flex>
        <Flex gap="xl" style={{ width: 'fit-content' }}>
          <Flex direction="column">
            <Badge color="green" variant="light" ml="md">
              Weekly Budget Progress
            </Badge>
            <div className={styles.chartContainer}>
              <PieChart className={styles.pie} data={pieData} size={240} />
              {startEnd.map(([start, end], i) => (
                <DonutChart
                  key={`${start}-${end}`}
                  startAngle={start}
                  endAngle={end}
                  className={styles.donut}
                  data={donutData[i]}
                  thickness={25}
                  size={300}
                  withTooltip={false}
                  paddingAngle={5}
                  pieChartProps={{
                    cy: 90,
                    innerRadius: 80,
                    outerRadius: 120,
                  }}
                />
              ))}
            </div>
          </Flex>
          <Flex direction="column" gap="sm">
            <Flex align="center" gap="sm">
              <Avatar src={'/mascot.webp'} />
              <Badge color="green">{"Finn's Daily Insight"}</Badge>
            </Flex>
            <Text maw={'100%'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Paper>
  );
}
