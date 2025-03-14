type AccountCategory = 'cash' | 'credit' | 'investment' | 'other';
type AccountSubcategory =
  | 'checking'
  | 'savings'
  | 'mortgage'
  | 'line_of_credit'
  | 'credit_card'
  | 'other';
type AccountStatus = 'active' | 'inactive' | 'disconnected';
interface AccountBalance {
  as_of: number;
  credit: {
    used: {
      usd: number;
    };
  };
  cash: {
    available: {
      usd: number;
    };
  };
  current: {
    usd: number;
  };
  type: AccountCategory;
}
interface AccountBalanceRefresh {
  last_attempted_at: number;
  next_refresh_available_at: number;
  status: string;
}

export interface AccountData {
  id: string;
  balance: AccountBalance;
  balance_refresh: AccountBalanceRefresh;
  display_name: string;
  last4: string;
  category: AccountCategory;
  subcategory: AccountSubcategory;
  institution_name: string;
  status: AccountStatus;
}
