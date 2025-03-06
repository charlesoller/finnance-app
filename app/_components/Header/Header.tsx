import { Burger, Flex, Text } from '@mantine/core';
import Link from 'next/link';
import queryClient from '../../_services/_clients/QueryClient';
import UserInfoMenu from '../UserInfoMenu/UserInfoMenu';
import { useDisclosure } from '@mantine/hooks';
import Nav from '../Nav/Nav';
import { usePathname } from 'next/navigation';
import { SESSION_KEY } from '../../_utils/_hooks/_mutations/queryKeys';
import { IconDashboard, IconDog } from '@tabler/icons-react';

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
      <Flex gap="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
          leftSection={<IconDog size="20px" />}
          active={pathname.includes('chat') || pathname === '/'}
          onClick={handleNavigation}
          w="fit-content"
        />
        <Nav
          href="/manage"
          label="Manage"
          leftSection={<IconDashboard size="20px" />}
          active={pathname.includes('manage')}
          onClick={handleNavigation}
          w="fit-content"
        />
        {/* <Nav
          href="/budget"
          label="Budget"
          leftSection={<IconClockDollar size='20px' />}
          active={pathname.includes('budget')}
          onClick={handleNavigation}
          w="fit-content"
        /> */}
      </Flex>
      <UserInfoMenu open={userMenuOpen} toggle={toggleUserMenu} />
    </Flex>
  );
}
