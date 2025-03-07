import {
  ActionIcon,
  Avatar,
  Flex,
  Loader,
  NumberFormatter,
  Paper,
  Text,
  Tooltip,
} from '@mantine/core';
import { AccountData } from '../../../../_models/AccountData';
import styles from './AccountCard.module.css';
import Link from 'next/link';
import { useChatContextStore } from '../../../../_stores/ChatContextStore';
import { timeAgo } from '../../Accounts.utils';
import { MouseEvent } from 'react';
import {
  IconEye,
  IconEyeClosed,
  IconMessageChatbot,
  IconMessageChatbotFilled,
} from '@tabler/icons-react';

interface AccountCardProps {
  acct: AccountData;
  selected: boolean;
  omitted: boolean;
  onSelect: (id: string) => void;
  onOmit: (e: MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void;
}

export default function AccountCard({
  acct,
  selected,
  onSelect,
  omitted,
  onOmit,
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
          decimalScale={2}
          fixedDecimalScale
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
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Flex gap="xs">
                <Tooltip label="Ask Finn a question about this account">
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    radius="xl"
                    color="gray"
                    onClick={(e) => onSelect(acct.id)}
                  >
                    {selected ? (
                      <IconMessageChatbotFilled />
                    ) : (
                      <IconMessageChatbot />
                    )}
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Temporarily hide this account from your summary">
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    radius="xl"
                    color="gray"
                    onClick={(e: any) => onOmit(e, acct.id)}
                  >
                    {omitted ? <IconEyeClosed /> : <IconEye />}
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </div>
            <Avatar size={'lg'} color="initials" name={acct.institution_name} />
            <Flex direction="column">
              <Text size="lg">
                {acct.display_name} (...{acct.last4})
              </Text>
              <Text c="dimmed" size="sm">
                {acct.institution_name}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" justify="center" align="flex-end">
            {getBalance()}
            {acct?.status === 'active' && (
              <Text c="dimmed" size="sm">
                {timeAgo(acct?.balance_refresh?.last_attempted_at)}
              </Text>
            )}
          </Flex>
        </Flex>
      </Paper>
    </Link>
  );
}
