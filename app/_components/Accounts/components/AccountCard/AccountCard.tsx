import {
  Avatar,
  Checkbox,
  Flex,
  Loader,
  NumberFormatter,
  Paper,
  Text,
} from '@mantine/core';
import { AccountData } from '../../../../_models/AccountData';
import styles from './AccountCard.module.css';
import Link from 'next/link';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';

interface AccountCardProps {
  acct: AccountData;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function AccountCard({
  acct,
  selected,
  onSelect,
}: AccountCardProps) {
  const { clearContext } = useChatContextStore();

  const getBalance = () => {
    const { status, balance } = acct;

    if (status === 'inactive') {
      return <Text c="red">Inactive</Text>;
    }

    if (status === 'active' && !balance) {
      return <Loader color="green" size="sm" />;
    }

    return (
      <Text size="xl">
        <NumberFormatter
          prefix="$"
          value={balance.current?.usd / 100 || 0}
          thousandSeparator
        />
      </Text>
    );
  };

  return (
    <Link
      href={`/manage/${acct.id}`}
      style={{
        textDecoration: 'none',
        color: 'unset',
      }}
      onClick={clearContext}
    >
      <Paper p="sm" className={styles.card}>
        <Flex justify="space-between">
          <Flex gap="sm" align="center">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selected}
                onChange={() => onSelect(acct.id)}
                color="green"
              />
            </div>
            <Avatar size={'lg'} color="initials" name={acct.institution_name} />
            <Flex direction="column">
              <Text size="lg">
                {acct.display_name} (...{acct.last4})
              </Text>
              <Text c="dimmed">{acct.institution_name}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" align="flex-end" justify="space-between">
            {getBalance()}
            <Text c="dimmed" size="sm">
              {acct.subcategory || acct.category}
            </Text>
          </Flex>
        </Flex>
      </Paper>
    </Link>
  );
}
