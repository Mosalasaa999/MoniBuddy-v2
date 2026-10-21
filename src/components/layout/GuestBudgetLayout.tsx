import React from 'react';
import CurrentCashWidget from '../budget/CurrentCashWidget';
import IncomeSection from '../budget/IncomeSection';
import ExpenseSection from '../budget/ExpenseSection';
import FlexiblePlanVisualizer from '../budget/FlexiblePlanVisualizer';

export default function GuestBudgetLayout() {
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-sm border-x border-gray-200 flex flex-col">
      <header className="px-6 py-5 border-b border-gray-200 bg-white sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">MoniBuddy</h1>
          <p className="text-xs text-gray-500">Offline Money Companion</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
          Offline Mode
        </span>
      </header>

      <main aria-live="polite" className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-20">
        <section>
          <CurrentCashWidget />
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            When do you next get paid?
          </h2>
          <IncomeSection />
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            What must be paid before then?
          </h2>
          <ExpenseSection />
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
            Your Flexible Timeline
          </h2>
          <FlexiblePlanVisualizer />
        </section>
      </main>
    </div>
  );
}