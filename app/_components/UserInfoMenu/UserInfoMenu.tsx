import styles from './UserInfoMenu.module.css';
import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Flex,
  Menu,
  Text,
} from '@mantine/core';
import LightDarkToggle from '../LightDarkToggle/LightDarkToggle';
import { useUserStore } from '../../_stores/UserStore';
import LogoutButton from '../LogoutButton/LogoutButton';
import { trimEmail } from './UserInfoMenu.utils';

export default function UserInfoMenu() {
  const { signInDetails } = useUserStore();

  return (
    <Menu shadow="md">
      <Menu.Target>
        <ActionIcon variant="transparent" radius="xl" size="lg">
          <Avatar color="initials" name={signInDetails.loginId} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown className={styles.menu}>
        <Flex direction="column" p="sm" gap="md">
          <Text>Hello, {trimEmail(signInDetails.loginId)}!</Text>
          <Divider />
          <Flex align="center" justify="space-between">
            <LightDarkToggle />
            <Button size="sm" variant="outline" color="green">
              Edit Settings
            </Button>
          </Flex>
          <Divider />
          <LogoutButton />
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
}
