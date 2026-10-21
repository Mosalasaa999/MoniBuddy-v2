import type { EssentialExpense, IncomeStream, TimelineEvent } from '../database/types';

export class BudgetEngine {
  static generateFlexiblePlan(
    currentCash: number,
    expenses: EssentialExpense[],
    incomes: IncomeStream[],
    horizonEndDate: number
  ): TimelineEvent[] {
    let runningBalance = currentCash;
    const timeline: TimelineEvent[] = [];

    const pendingExpenses = expenses
      .filter((e) => !e.is_paid && e.due_date <= horizonEndDate)
      .map((e) => ({
        date: e.due_date,
        type: 'EXPENSE' as const,
        description: e.name,
        amount: -e.amount,
      }));

    const expectedIncomes = incomes
      .filter((i) => i.is_active && i.expected_date <= horizonEndDate)
      .map((i) => ({
        date: i.expected_date,
        type: 'INCOME' as const,
        description: i.name,
        amount: i.amount,
      }));

    const events = [...pendingExpenses, ...expectedIncomes].sort(
      (a, b) => a.date - b.date
    );

    for (const event of events) {
      runningBalance += event.amount;
      timeline.push({
        date: event.date,
        type: event.type,
        description: event.description,
        amount: Math.abs(event.amount),
        projectedBalance: runningBalance,
        isShortfall: runningBalance < 0,
      });
    }

    return timeline;
  }
}
