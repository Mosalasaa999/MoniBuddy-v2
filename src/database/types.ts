export type TransactionType = 'INCOME' | 'EXPENSE';
export type Frequency = 'ONCE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface UserProfile {
  id: string;
  name: string;
  current_cash: number;
  created_at: number;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
}

export interface IncomeStream {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  expected_date: number;
  frequency: Frequency;
  is_active: boolean;
}

export interface EssentialExpense {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  due_date: number;
  is_paid: boolean;
}

export interface TimelineEvent {
  date: number;
  type: TransactionType;
  description: string;
  amount: number;
  projectedBalance: number;
  isShortfall: boolean;
}
