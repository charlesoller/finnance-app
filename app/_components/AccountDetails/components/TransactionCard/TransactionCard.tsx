import { Checkbox, Flex, NumberFormatter, Paper, Text } from '@mantine/core';
import styles from './TransactionCard.module.css';
import { TransactionData } from '../../../../_models/TransactionData';

interface TransactionCardProps {
  tx: TransactionData;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function TransactionCard({
  tx,
  selected,
  onSelect,
}: TransactionCardProps) {
  return (
    <Paper p="sm" className={styles.card}>
      <Flex justify="space-between">
        <Flex gap="sm" align="center">
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected}
              onChange={() => onSelect(tx.id)}
              color="green"
            />
          </div>
          <Flex direction="column">
            <Text size="lg">{tx.description}</Text>
            <Text c="dimmed">{String(new Date(tx.transacted_at * 1000))}</Text>
          </Flex>
        </Flex>
        <Flex direction="column" justify="flex-end" align="flex-end">
          <Text size="xl">
            <NumberFormatter prefix="$" value={tx.amount} thousandSeparator />
          </Text>
        </Flex>
      </Flex>
    </Paper>
  );
}
