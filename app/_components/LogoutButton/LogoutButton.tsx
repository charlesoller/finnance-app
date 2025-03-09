import { ActionIcon, Loader, Tooltip } from '@mantine/core';
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
      <ActionIcon size="lg" radius="md" color="red" onClick={handleLogout}>
        {loading ? <Loader color="gray" size="sm" /> : <IconLogout />}
      </ActionIcon>
    </Tooltip>
  );
}
