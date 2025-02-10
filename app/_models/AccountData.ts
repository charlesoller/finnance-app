type AccountCategory = 'cash' | 'credit' | 'investment' | 'other';
type AccountSubcategory =
  | 'checking'
  | 'savings'
  | 'mortgage'
  | 'line_of_credit'
  | 'credit_card'
  | 'other';

export interface AccountData {
  id: string;
  balance: any;
  display_name: string;
  last4: string;
  category: AccountCategory;
  subcategory: AccountSubcategory;
  institution_name: string;
}
