import { AccountData } from '../../_models/AccountData';

export interface GroupedAccounts {
  cash?: AccountData[];
  credit?: AccountData[];
  investment?: AccountData[];
  other?: AccountData[];
}

export const groupAccountsByType = (accounts: AccountData[]) => {
  const grouped: GroupedAccounts = {};

  accounts.forEach((acct) => {
    const { category } = acct;
    if (grouped[category]) {
      grouped[category] = [...grouped[category], acct];
    } else {
      grouped[category] = [acct];
    }
  });

  return grouped;
};

export const getCurrentNet = (accounts: GroupedAccounts) => {
  let total: number = 0;
  accounts.cash?.forEach((acct) => (total += acct.balance?.current?.usd || 0));
  accounts.investment?.forEach(
    (acct) => (total += acct.balance?.current?.usd || 0),
  );
  accounts.credit?.forEach(
    (acct) => (total -= acct.balance?.current?.usd || 0),
  );
  return total;
};
