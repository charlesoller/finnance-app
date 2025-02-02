import AuthenticationModal from './AuthModal/AuthenticationModal';
import DisclaimerModal from './DisclaimerModal/DisclaimerModal';

export const MODALS = {
  disclaimer: DisclaimerModal,
  authentication: AuthenticationModal,
};

export const AUTH_MODAL = {
  modal: 'authentication',
  innerProps: {},
  withCloseButton: false,
  closeOnClickOutside: false,
  closeOnEscape: false,
};

export const DISCLAIMER_MODAL = {
  modal: 'disclaimer',
  title: 'Disclaimer',
  innerProps: {},
};

export const getModalById = (id: string | null) => {
  if (!id) return null;
  if (id === 'authentication') return AUTH_MODAL;
  if (id === 'disclaimer') return DISCLAIMER_MODAL;
  return null;
};
