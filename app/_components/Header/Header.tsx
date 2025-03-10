import { Flex, Text } from '@mantine/core';
import Link from 'next/link';
import queryClient from '../../_services/_clients/QueryClient';
import UserInfoMenu from '../UserInfoMenu/UserInfoMenu';
import { useDisclosure } from '@mantine/hooks';
import Nav from '../Nav/Nav';
import { usePathname } from 'next/navigation';
import { SESSION_KEY } from '../../_utils/_hooks/_mutations/queryKeys';
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconMessageChatbot,
  IconMessageChatbotFilled,
  IconSeedling,
  IconSeedlingFilled,
} from '@tabler/icons-react';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export default function Header({ opened, toggle }: HeaderProps) {
  const [userMenuOpen, { toggle: toggleUserMenu }] = useDisclosure();
  const pathname = usePathname();

  const handleNavigation = () => {
    queryClient.setQueryData([SESSION_KEY], []);
  };
  return (
    <Flex align="center" justify="space-between" h="100%" px="xl">
      <Flex gap="md" align="centerfg">
        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> */}
        <Link
          href={'/chat'}
          style={{ textDecoration: 'none' }}
          onClick={handleNavigation}
        >
          <Text fw={700} size="xl" c="green" style={{ textDecoration: 'none' }}>
            Finnance
          </Text>
        </Link>
        <Nav
          href="/chat"
          label="Advisor"
          leftSection={
            pathname.includes('chat') || pathname === '/' ? (
              <IconMessageChatbotFilled size="20px" />
            ) : (
              <IconMessageChatbot size="20px" />
            )
          }
          active={pathname.includes('chat') || pathname === '/'}
          onClick={handleNavigation}
          w="fit-content"
        />
        <Nav
          href="/manage"
          label="Manage"
          leftSection={
            pathname.includes('manage') ? (
              <IconLayoutDashboardFilled size="20px" />
            ) : (
              <IconLayoutDashboard size="20px" />
            )
          }
          active={pathname.includes('manage')}
          onClick={handleNavigation}
          w="fit-content"
        />
        <Nav
          href="/plan"
          label="Plan"
          leftSection={
            pathname.includes('plan') ? (
              <IconSeedlingFilled />
            ) : (
              <IconSeedling />
            )
          }
          active={pathname.includes('plan')}
          onClick={handleNavigation}
          w="fit-content"
        />
      </Flex>
      <UserInfoMenu open={userMenuOpen} toggle={toggleUserMenu} />
    </Flex>
  );
}
