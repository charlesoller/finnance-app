'use client';

import { Flex } from '@mantine/core';
import BudgetTracker from '../BudgetTracker/BudgetTracker';
import AllTransactionsList from '../Accounts/components/AllTransactionsList/AllTransactionsList';

export default function Plan() {
  return (
    <Flex
      direction="column"
      maw="1024px"
      m="auto"
      h={{ base: '93dvh', fallback: '93vh' }}
      style={{
        overflowY: 'auto',
      }}
    >
      <BudgetTracker />
      <AllTransactionsList onSelect={() => {}} />
    </Flex>
  );
}
