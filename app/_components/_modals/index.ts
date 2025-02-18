import AuthenticationModal from './AuthModal/AuthenticationModal';
import ConfirmDisconnectModal from './ConfirmDisconnectModal/ConfirmDisconnectModal';
import DisclaimerModal from './DisclaimerModal/DisclaimerModal';
import UserSettingsModal from './UserSettingsModal/UserSettingsModal';

export const MODALS = {
  disclaimer: DisclaimerModal,
  authentication: AuthenticationModal,
  userSettings: UserSettingsModal,
  confirmDisconnect: ConfirmDisconnectModal,
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

export const CONFIRM_DISCONNECT_MODAL = {
  modal: 'confirmDisconnect',
  title: 'Are you sure you want to disconnect this account?',
  innerProps: {},
};

export const getModalById = (id: string | null) => {
  if (!id) return null;
  if (id === 'authentication') return AUTH_MODAL;
  if (id === 'disclaimer') return DISCLAIMER_MODAL;
  if (id === 'userSettings') return USER_SETTINGS_MODAL;
  if (id === 'confirmDisconnect') return CONFIRM_DISCONNECT_MODAL;
  return null;
};
