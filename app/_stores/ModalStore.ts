import { create } from 'zustand';
import { modals } from '@mantine/modals';
import { OpenContextModal } from '@mantine/modals/lib/context';

type OpenModalOptions = OpenContextModal<any> & { modal: string };

interface ModalStore {
  openModals: Set<string>;
  openModal: (options: OpenModalOptions) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
}

export const useModalStore = create<ModalStore>((set: any, get: any) => ({
  openModals: new Set(),

  openModal: (options: any) => {
    set((state: any) => {
      const newModals = new Set(state.openModals);
      newModals.add(options.modal);
      return { openModals: newModals };
    });

    const url = new URL(window.location.href);
    url.searchParams.set('open', options.modal);
    window.history.pushState({}, '', url.toString());

    modals.openContextModal({
      ...options,
      radius: 'lg',
      onClose: () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('open');
        window.history.pushState({}, '', url.toString());

        setTimeout(() => {
          set((state: any) => {
            const newModals = new Set(state.openModals);
            newModals.delete(options.modal);
            return { openModals: newModals };
          });
        }, 0);
      },
    });
  },

  closeModal: (id) => {
    modals.close(id);

    const url = new URL(window.location.href);
    url.searchParams.delete('open');
    window.history.pushState({}, '', url.toString());

    set((state: any) => {
      const newModals = new Set(state.openModals);
      newModals.delete(id);
      return { openModals: newModals };
    });
  },

  closeAllModals: () => {
    modals.closeAll();

    const url = new URL(window.location.href);
    url.searchParams.delete('open');
    window.history.pushState({}, '', url.toString());

    set(() => {
      return { openModals: new Set() };
    });
  },

  isModalOpen: (id) => {
    return get().openModals.has(id);
  },
}));
