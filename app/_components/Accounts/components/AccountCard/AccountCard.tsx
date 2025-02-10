import { Avatar, Flex, NumberFormatter, Paper, Text } from '@mantine/core';
import { AccountData } from '../../../../_models/AccountData';
import styles from './AccountCard.module.css';

interface AccountCardProps {
  acct: AccountData;
}

export default function AccountCard({ acct }: AccountCardProps) {
  return (
    <Paper p="sm" className={styles.card}>
      <Flex justify="space-between">
        <Flex gap="sm" align="center">
          <Avatar size={'lg'} color="initials" name={acct.institution_name} />
          <Flex direction="column">
            <Text size="lg">
              {acct.display_name} (...{acct.last4})
            </Text>
            <Text c="dimmed">{acct.institution_name}</Text>
          </Flex>
        </Flex>
        <Flex direction="column" justify="flex-end" align="flex-end">
          <Text size="xl">
            <NumberFormatter
              prefix="$"
              value={acct?.balance?.current?.usd / 100 || 0}
              thousandSeparator
            />
          </Text>
          <Text c="dimmed" size="sm">
            {acct.subcategory || acct.category}
          </Text>
        </Flex>
      </Flex>
    </Paper>
  );
}
