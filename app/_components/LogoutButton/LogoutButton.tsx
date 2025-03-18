import { Button, Flex, Loader, Text, Tooltip } from '@mantine/core';
import { signOut } from 'aws-amplify/auth';
import { useUserStore } from '../../_stores/UserStore';
import { useModalStore } from '../../_stores/ModalStore';
import { useFormState } from '../../_utils/_hooks/useFormState';
import { AUTH_MODAL } from '../_modals';
import { useRouter } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';

export default function LogoutButton() {
  const { loading, error, startReq, endReq } = useFormState();
  const router = useRouter();
  const { clearUser } = useUserStore();
  const { openModal } = useModalStore();

  const handleLogout = async () => {
    startReq();
    await signOut()
      .then(() => {
        openModal(AUTH_MODAL);
        clearUser();
        router.push('/');
        endReq();
      })
      .catch((e) => endReq(e));
  };

  return (
    <Tooltip label="Logout">
      <Button radius="md" color="red" onClick={handleLogout}>
        <Flex gap="xs" align="center">
          <Text fw="bold">Logout</Text>
          {loading ? <Loader color="white" size="sm" /> : <IconLogout />}
        </Flex>
      </Button>
    </Tooltip>
  );
}
