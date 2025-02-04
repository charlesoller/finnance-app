import AuthenticationModal from './AuthModal/AuthenticationModal';
import DisclaimerModal from './DisclaimerModal/DisclaimerModal';
import UserSettingsModal from './UserSettingsModal/UserSettingsModal';

export const MODALS = {
  disclaimer: DisclaimerModal,
  authentication: AuthenticationModal,
  userSettings: UserSettingsModal,
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

export const USER_SETTINGS_MODAL = {
  modal: 'userSettings',
  title: 'User Settings',
  innerProps: {},
};

export const getModalById = (id: string | null) => {
  if (!id) return null;
  if (id === 'authentication') return AUTH_MODAL;
  if (id === 'disclaimer') return DISCLAIMER_MODAL;
  if (id === 'userSettings') return USER_SETTINGS_MODAL;
  return null;
};
