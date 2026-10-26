// Income Flow 
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function IncomeSection() {
  const { incomes, addIncome } = useAppStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [daysAway, setDaysAway] = useState('7');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedDays = parseInt(daysAway, 10);
    if (!name || isNaN(parsedAmount) || isNaN(parsedDays)) return;

    // Calculate future timestamp (offline-safe)
    const expectedDate = Date.now() + parsedDays * 24 * 60 * 60 * 1000;

    addIncome({
      user_id: 'guest',
      name,
      amount: parsedAmount,
      expected_date: expectedDate,
      frequency: 'ONCE',
      is_active: true,
    });

    setName('');
    setAmount('');
  };

  return (
    <div className="space-y-4">
      {/* Existing Streams */}
      <div className="space-y-2">
        {incomes.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">
                In {Math.round((item.expected_date - Date.now()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <span className="font-bold text-emerald-600">+R{item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Quick Entry Form */}
      <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="e.g. Spaza sales, Wages"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2.5 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Amount (R)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2.5 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs text-gray-600 whitespace-nowrap">Expected in (days):</label>
          <input
            type="number"
            value={daysAway}
            onChange={(e) => setDaysAway(e.target.value)}
            className="w-20 p-2 text-sm bg-white rounded-lg border border-gray-300 text-center"
          />
          <button
            type="submit"
            className="flex-1 bg-gray-900 text-white text-sm font-semibold py-2 px-4 rounded-lg active:scale-95 transition-transform"
          >
            Add Expected
          </button>
        </div>
      </form>
    </div>
  );
}