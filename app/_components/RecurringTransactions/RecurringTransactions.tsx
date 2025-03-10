import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Flex,
  Loader,
  Text,
  Title,
} from '@mantine/core';
import TransactionCard from '../AccountDetails/components/TransactionCard/TransactionCard';
import { ValidRecurrencePattern } from './RecurringTransactions.types';
import {
  IconCalendarMonth,
  IconCalendarStats,
  IconCalendarWeek,
} from '@tabler/icons-react';
import { useChatContextStore } from '../../_stores/ChatContextStore';
import { useRecurringTransactions } from '../../_utils/_hooks/useRecurringCharges';

interface RecurringTransactionsProps {
  onSelect: (id: string) => void;
}

export default function RecurringTransactions({
  onSelect,
}: RecurringTransactionsProps) {
  const { recurringTransactions: groupedRecurringTransactions, loading } =
    useRecurringTransactions();

  const { isActiveTxnId } = useChatContextStore();

  const getIcon = (pattern: ValidRecurrencePattern) => {
    if (pattern === 'weekly') {
      return <IconCalendarWeek />;
    }
    if (pattern === 'monthly') {
      return <IconCalendarMonth />;
    }
    if (pattern === 'yearly') {
      return <IconCalendarStats />;
    }
  };

  if (loading) return <Loader color="green" m="auto" p="xl" />;
  if (!loading && !Object.keys(groupedRecurringTransactions).length) {
    return (
      <Text m="auto" p="xl">
        No recurring charges found
      </Text>
    );
  }

  return (
    <Accordion multiple={true}>
      {Object.keys(groupedRecurringTransactions).map((group) => {
        const name = group.split('_')[0];
        const pattern = groupedRecurringTransactions[group].pattern;

        return (
          <AccordionItem key={group} value={group}>
            <AccordionControl>
              <Flex p="xs" justify="space-between">
                <Flex align="center" gap="md">
                  {getIcon(pattern)}
                  <Title order={3}>{name}</Title>
                </Flex>
              </Flex>
            </AccordionControl>
            <AccordionPanel>
              {groupedRecurringTransactions[group].transactions.map((txn) => (
                <TransactionCard
                  key={txn.id}
                  tx={txn}
                  selected={isActiveTxnId(txn.id)}
                  onSelect={onSelect}
                  showAccountName
                  showDate
                />
              ))}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
