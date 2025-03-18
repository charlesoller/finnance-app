import styles from './UserInfoMenu.module.css';
import {
  ActionIcon,
  Avatar,
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
// import { IconSettings } from '@tabler/icons-react';

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
        <Flex direction="column" p="sm">
          <Text>Hello, {trimEmail(email)}!</Text>
          <Text size="xs" c="dimmed">
            {email}
          </Text>
          <Divider my="md" />
          <Flex align="center" justify="space-between" gap="md">
            <LightDarkToggle />
            {/* <Tooltip label="Edit user settings">
              <ActionIcon
                size="lg"
                variant="subtle"
                radius="xl"
                onClick={handleOpenSettings}
                color="white"
              >
                <IconSettings />
              </ActionIcon>
            </Tooltip> */}
            <LogoutButton />
          </Flex>
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
}
