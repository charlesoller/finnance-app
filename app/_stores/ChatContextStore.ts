import { create } from 'zustand';

interface ChatContextStore {
  selectedAccountIds: string[];
  selectedTransactionIds: string[];
  omittedAccounts: string[];
  addTxnId: (id: string) => void;
  removeTxnId: (id: string) => void;
  addAcctId: (id: string) => void;
  removeAcctId: (id: string) => void;
  addOmitAcct: (id: string) => void;
  removeOmitAcct: (id: string) => void;
  handleSelectAcct: (id: string) => void;
  handleSelectTxn: (id: string) => void;
  handleOmitAcct: (id: string) => void;
  isActiveAcctId: (id: string) => boolean;
  isActiveTxnId: (id: string) => boolean;
  isOmittedAcct: (id: string) => boolean;
  getContext: () => string[];
  clearContext: () => void;
}

export const useChatContextStore = create<ChatContextStore>(
  (set: any, get: any) => ({
    selectedAccountIds: [],
    selectedTransactionIds: [],
    omittedAccounts: [],

    addTxnId: (id: string) => {
      set({
        selectedTransactionIds: [...get().selectedTransactionIds, id],
      });
    },
    removeTxnId: (id: string) => {
      set({
        selectedTransactionIds: get().selectedTransactionIds.filter(
          (txnId: string) => txnId !== id,
        ),
      });
    },
    addAcctId: (id: string) => {
      set({
        selectedAccountIds: [...get().selectedAccountIds, id],
      });
    },
    removeAcctId: (id: string) => {
      set({
        selectedAccountIds: get().selectedAccountIds.filter(
          (acctId: string) => acctId !== id,
        ),
      });
    },
    addOmitAcct: (id: string) => {
      set({
        omittedAccounts: [...get().omittedAccounts, id],
      });
    },
    removeOmitAcct: (id: string) => {
      set({
        omittedAccounts: get().omittedAccounts.filter(
          (acctId: string) => acctId !== id,
        ),
      });
    },
    isActiveAcctId: (id: string) => {
      return get().selectedAccountIds.includes(id);
    },
    isActiveTxnId: (id: string) => {
      return get().selectedTransactionIds.includes(id);
    },
    isOmittedAcct: (id: string) => {
      return get().omittedAccounts.includes(id);
    },
    handleSelectAcct: (id: string) => {
      if (get().isActiveAcctId(id)) {
        get().removeAcctId(id);
      } else {
        get().addAcctId(id);
      }
    },
    handleSelectTxn: (id: string) => {
      if (get().isActiveTxnId(id)) {
        get().removeTxnId(id);
      } else {
        get().addTxnId(id);
      }
    },
    handleOmitAcct: (id: string) => {
      if (get().isOmittedAcct(id)) {
        get().removeOmitAcct(id);
      } else {
        get().addOmitAcct(id);
      }
    },
    getContext: () => {
      const acctIds = get().selectedAccountIds;
      const txnIds = get().selectedTransactionIds;
      const context: string[] = [];

      if (!!acctIds.length) {
        context.push(
          `The user has the following account IDs selected: ${acctIds.join(', ')}`,
        );
      }
      if (!!txnIds.length) {
        context.push(
          `The user has the following transaction IDs selected: ${txnIds.join(', ')}`,
        );
      }

      return context;
    },
    clearContext: () => {
      set({
        selectedAccountIds: [],
        selectedTransactionIds: [],
      });
    },
  }),
);
