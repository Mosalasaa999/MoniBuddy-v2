import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, IncomeStream, EssentialExpense } from '../database/types';

interface LocalState {
  isHydrated: boolean;
  user: UserProfile | null;
  incomes: IncomeStream[];
  expenses: EssentialExpense[];
  
  setHydrated: (state: boolean) => void;
  initializeLocalDB: () => Promise<void>;
  updateCash: (amount: number) => Promise<void>;
  addExpense: (expense: Omit<EssentialExpense, 'id'>) => Promise<void>;
  addIncome: (income: Omit<IncomeStream, 'id'>) => Promise<void>;
  markExpensePaid: (id: string) => Promise<void>;
  resetStore: () => void;
}

export const useAppStore = create<LocalState>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      user: { id: 'guest', name: 'Guest', current_cash: 0, created_at: Date.now() },
      incomes: [],
      expenses: [],

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      initializeLocalDB: async () => {
        // Hydration handled deterministically by persist middleware
        set({ isHydrated: true });
      },

      updateCash: async (amount) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, current_cash: amount } });
      },

      addExpense: async (expense) => {
        const newExpense: EssentialExpense = { ...expense, id: crypto.randomUUID() };
        set((state) => ({ 
          expenses: [...state.expenses, newExpense].sort((a, b) => a.due_date - b.due_date) 
        }));
      },

      addIncome: async (income) => {
        const newIncome: IncomeStream = { ...income, id: crypto.randomUUID() };
        set((state) => ({ 
          incomes: [...state.incomes, newIncome].sort((a, b) => a.expected_date - b.expected_date) 
        }));
      },

      markExpensePaid: async (id) => {
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, is_paid: !e.is_paid } : e
          ),
        }));
      },

      resetStore: () => {
        set({
          user: { id: 'guest', name: 'Guest', current_cash: 0, created_at: Date.now() },
          incomes: [],
          expenses: [],
        });
      },
    }),
    {
      name: 'monibuddy-offline-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        incomes: state.incomes,
        expenses: state.expenses,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
