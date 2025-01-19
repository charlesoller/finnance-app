import { ActionIcon, Burger, Flex, Text } from '@mantine/core';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { AppColorScheme } from '../../_utils/types';
import queryClient from '../../_services/QueryClient';
import { useSessionId } from '../../_utils/hooks/useSessionId';
import { ChatMessage } from '../../_models/ChatMessage';
import styles from './Header.module.css';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
  colorScheme: AppColorScheme;
  toggleColorScheme: () => void;
}

export default function Header({
  opened,
  toggle,
  colorScheme,
  toggleColorScheme,
}: HeaderProps) {
  const { setSessionId } = useSessionId();

  const handleNavigation = () => {
    setSessionId('');
    queryClient.setQueryData<ChatMessage[]>(
      ['session'],
      [
        {
          message_id: 'LOADING',
          user_id: '123',
          message_type: 'USER',
          message_content: '',
          session_id: '',
          timestamp: new Date().toISOString(),
        },
      ],
    );
  };

  return (
    <Flex align="center" justify="space-between" h="100%" px="xl">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Link
        href={'/'}
        style={{ textDecoration: 'none' }}
        onClick={handleNavigation}
      >
        <Text fw={700} size="xl" c="green" style={{ textDecoration: 'none' }}>
          Finnance
        </Text>
      </Link>
      <ActionIcon
        variant="outline"
        color={colorScheme === 'dark' ? 'yellow' : 'blue'}
        onClick={toggleColorScheme}
        title="Toggle color scheme"
      >
        {colorScheme === 'dark' ? (
          <SunIcon className={styles.sun} />
        ) : (
          <MoonIcon className={styles.moon} />
        )}
      </ActionIcon>
    </Flex>
  );
}
