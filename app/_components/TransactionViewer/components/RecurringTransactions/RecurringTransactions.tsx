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
import { ValidRecurrencePattern } from './RecurringTransactions.types';
import {
  IconCalendarMonth,
  IconCalendarStats,
  IconCalendarWeek,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { useRecurringTransactions } from '../../TransactionViewer.hooks';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';
import TransactionCard from '../TransactionCard/TransactionCard';
import { TransactionData } from '../../../../_models/TransactionData';

interface RecurringTransactionsProps {
  onSelect?: (id: string) => void;
  accountId?: string;
}

export default function RecurringTransactions({
  onSelect,
  accountId,
}: RecurringTransactionsProps) {
  const { recurringTransactions: groupedRecurringTransactions, loading } =
    useRecurringTransactions();

  const groupedAndFilteredRecurringTransactions = useMemo(() => {
    if (accountId) {
      // Filter the object to only include entries where the key contains the accountId
      return Object.keys(groupedRecurringTransactions)
        .filter((key) => key.includes(accountId))
        .reduce(
          (filtered, key) => {
            (filtered as any)[key] = groupedRecurringTransactions[key];
            return filtered;
          },
          {} as Record<
            string,
            (typeof groupedRecurringTransactions)[keyof typeof groupedRecurringTransactions]
          >,
        );
    }
    return groupedRecurringTransactions;
  }, [groupedRecurringTransactions, accountId]);

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
  if (
    !loading &&
    !Object.keys(groupedAndFilteredRecurringTransactions).length
  ) {
    return (
      <Text m="auto" p="xl">
        No recurring charges found
      </Text>
    );
  }

  return (
    <Accordion multiple={true}>
      {Object.keys(groupedAndFilteredRecurringTransactions).map((group) => {
        const name = group.split('_')[0];
        const pattern = groupedAndFilteredRecurringTransactions[group].pattern;

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
              {groupedAndFilteredRecurringTransactions[group].transactions.map(
                (txn: TransactionData) => (
                  <TransactionCard
                    key={txn.id}
                    tx={txn}
                    selected={isActiveTxnId(txn.id)}
                    onSelect={onSelect}
                    showAccountName
                    showDate
                  />
                ),
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
