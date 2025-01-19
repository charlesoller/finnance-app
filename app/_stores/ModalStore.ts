import { create } from 'zustand';
import { modals } from '@mantine/modals';
import { OpenContextModal } from '@mantine/modals/lib/context';

type OpenModalOptions = OpenContextModal<any> & { modal: string };

interface ModalStore {
  openModals: Set<string>;
  openModal: (options: OpenModalOptions) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  openModals: new Set(),

  openModal: (options) => {
    set((state) => {
      const newModals = new Set(state.openModals);
      newModals.add(options.modal);
      return { openModals: newModals };
    });

    modals.openContextModal({
      ...options,
      onClose: () => {
        setTimeout(() => {
          set((state) => {
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
    set((state) => {
      const newModals = new Set(state.openModals);
      newModals.delete(id);
      return { openModals: newModals };
    });
  },

  isModalOpen: (id) => {
    return get().openModals.has(id);
  },
}));
