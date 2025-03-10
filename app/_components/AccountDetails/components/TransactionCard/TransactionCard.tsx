import {
  ActionIcon,
  Avatar,
  Flex,
  NumberFormatter,
  Paper,
  Text,
  Tooltip,
} from '@mantine/core';
import styles from './TransactionCard.module.css';
import { TransactionData } from '../../../../_models/TransactionData';
import {
  capitalize,
  formatDate,
  getBankLogoSrc,
} from '../../../../_utils/utils';
import {
  IconMessageChatbot,
  IconMessageChatbotFilled,
} from '@tabler/icons-react';
import { AccountData } from '../../../../_models/AccountData';

interface TransactionCardProps {
  tx: TransactionData;
  selected: boolean;
  onSelect: (id: string) => void;
  acct?: AccountData;
  showAccountName?: boolean;
  showDate?: boolean;
}

export default function TransactionCard({
  tx,
  selected,
  onSelect,
  acct,
  showAccountName = false,
  showDate = false,
}: TransactionCardProps) {
  const institution = acct?.institution_name || tx.institution_name || '';
  const acctName = acct?.display_name || tx.acct_display_name || '';
  const acctLast4 = acct?.last4 || tx.acct_last4 || '';

  return (
    <Paper p="sm" className={styles.card}>
      <Flex justify="space-between">
        <Flex gap="sm" align="center">
          <div onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Ask Finn a question about this account">
              <ActionIcon
                size="lg"
                variant="subtle"
                radius="xl"
                color="gray"
                onClick={(e) => onSelect(tx.id)}
              >
                {selected ? (
                  <IconMessageChatbotFilled />
                ) : (
                  <IconMessageChatbot />
                )}
              </ActionIcon>
            </Tooltip>
          </div>
          <Avatar size="lg" src={getBankLogoSrc(institution)} />
          <Flex direction="column">
            <Text size="lg">{tx.description}</Text>
            <Text c="dimmed">
              {institution}
              {showAccountName && !!acctName.length && ` ${acctName}`}
              {showAccountName && !!acctLast4.length && ` (...${acctLast4})`}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="column" justify="flex-end" align="flex-end">
          <Text size="lg">
            <NumberFormatter
              prefix="$"
              value={tx.amount / 100}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
            />
          </Text>
          <Text c="dimmed">
            {capitalize(tx.status)}
            {showDate &&
              ` | ${formatDate(new Date(tx.transacted_at * 1000), true)}`}
          </Text>
        </Flex>
      </Flex>
    </Paper>
  );
}
