// Timeline Visualizer 
import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BudgetEngine } from '../../engine/BudgetEngine';

export default function FlexiblePlanVisualizer() {
  const { user, expenses, incomes } = useAppStore();

  // Project ahead 30 days
  const horizon = useMemo(() => Date.now() + 30 * 24 * 60 * 60 * 1000, []);

  const timeline = useMemo(() => {
    return BudgetEngine.generateFlexiblePlan(
      user?.current_cash || 0,
      expenses,
      incomes,
      horizon
    );
  }, [user?.current_cash, expenses, incomes, horizon]);

  if (timeline.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-sm text-gray-500">
        Add an expected income or upcoming expense to generate your cash timeline.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {timeline.map((event, idx) => {
        const daysAway = Math.max(0, Math.round((event.date - Date.now()) / (1000 * 60 * 60 * 24)));
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex justify-between items-center ${
              event.isShortfall
                ? 'bg-amber-50 border-amber-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{event.description}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {daysAway === 0 ? 'Today' : `Day +${daysAway}`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {event.type === 'INCOME' ? `+R${event.amount.toFixed(2)}` : `-R${event.amount.toFixed(2)}`}
              </p>
            </div>

            <div className="text-right">
              <span className={`block font-bold text-base ${event.isShortfall ? 'text-amber-700' : 'text-gray-900'}`}>
                R{event.projectedBalance.toFixed(2)}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded ${
                event.isShortfall ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {event.isShortfall ? 'Buffer Needed' : 'Safe'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}