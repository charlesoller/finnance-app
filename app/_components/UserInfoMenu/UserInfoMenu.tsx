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
import { useModalStore } from '../../_stores/ModalStore';
import { USER_SETTINGS_MODAL } from '../_modals';

interface UserMenuProps {
  open: boolean;
  toggle: () => void;
}

export default function UserInfoMenu({ open, toggle }: UserMenuProps) {
  const { email, userId } = useUserStore();

  const { openModal } = useModalStore();

  const handleOpenSettings = () => {
    openModal(USER_SETTINGS_MODAL);
    toggle();
  };

  return (
    <Menu shadow="md" opened={open} onChange={toggle}>
      <Menu.Target>
        <ActionIcon variant="transparent" radius="xl" size="lg">
          <Avatar color="initials" name={trimEmail(email)} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown className={styles.menu}>
        <Flex direction="column" p="sm" gap="md">
          <Text>Hello, {trimEmail(email)}!</Text>
          <Divider />
          <Flex align="center" justify="space-between">
            <LightDarkToggle />
            <Button
              size="sm"
              variant="outline"
              color="green"
              onClick={handleOpenSettings}
            >
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
