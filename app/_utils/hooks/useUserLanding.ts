import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { useModalStore } from '../../_stores/ModalStore';
import { useUserStore } from '../../_stores/UserStore';

export const useUserLanding = () => {
  const { openModal } = useModalStore();
  const { setUserData, fetchToken } = useUserStore();

  useEffect(() => {
    const getAuthStatus = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();

        setUserData({ username, userId, signInDetails });
        fetchToken();
      } catch {
        openModal({
          modal: 'authentication',
          innerProps: {},
          withCloseButton: false,
          closeOnClickOutside: false,
          closeOnEscape: false,
        });
      }
    };

    getAuthStatus();
  }, [openModal, setUserData, fetchToken]);
};
