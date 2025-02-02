import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useRef } from 'react';
import { useModalStore } from '../../_stores/ModalStore';
import { useUserStore } from '../../_stores/UserStore';
import { AUTH_MODAL, getModalById } from '../../_components/_modals';
import { useSearchParams } from 'next/navigation';

export const useUserLanding = () => {
  const { openModal } = useModalStore();
  const { setUserData, fetchToken } = useUserStore();
  const searchParams = useSearchParams();
  const modalId = searchParams.get('open');
  const modal = getModalById(modalId);
  const initialLoadDone = useRef(false);
  if (!modal) {
    initialLoadDone.current = true;
  }

  useEffect(() => {
    const getAuthStatus = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();

        setUserData({ username, userId, signInDetails });
        fetchToken();
      } catch {
        openModal(AUTH_MODAL);
      }
    };

    getAuthStatus();
  }, [openModal, setUserData, fetchToken]);

  useEffect(() => {
    if (modal && !initialLoadDone.current) {
      openModal(modal);
      initialLoadDone.current = true;
    }
  }, [modal, openModal]);
};
