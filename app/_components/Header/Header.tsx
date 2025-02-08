import { Burger, Flex, Text } from '@mantine/core';
import Link from 'next/link';
import queryClient from '../../_services/QueryClient';
import { ChatMessage } from '../../_models/ChatMessage';
import UserInfoMenu from '../UserInfoMenu/UserInfoMenu';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export default function Header({ opened, toggle }: HeaderProps) {
  // const { setSessionId } = useSessionId();

  const handleNavigation = () => {
    // setSessionId('');
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
      <UserInfoMenu />
    </Flex>
  );
}
