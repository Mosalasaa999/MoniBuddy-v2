// Expense Flow 
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function ExpenseSection() {
  const { expenses, addExpense, markExpensePaid } = useAppStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDays, setDueDays] = useState('3');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedDays = parseInt(dueDays, 10);
    if (!name || isNaN(parsedAmount) || isNaN(parsedDays)) return;

    const dueDate = Date.now() + parsedDays * 24 * 60 * 60 * 1000;

    addExpense({
      user_id: 'guest',
      category_id: 'essential',
      name,
      amount: parsedAmount,
      due_date: dueDate,
      is_paid: false,
    });

    setName('');
    setAmount('');
  };

  return (
    <div className="space-y-4">
      {/* List */}
      <div className="space-y-2">
        {expenses.map((item) => (
          <div
            key={item.id}
            onClick={() => markExpensePaid(item.id)}
            className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-colors ${
              item.is_paid ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-gray-200'
            }`}
          >
            <div>
              <p className={`font-semibold text-gray-800 ${item.is_paid ? 'line-through' : ''}`}>
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.is_paid ? 'Paid' : `Due in ${Math.round((item.due_date - Date.now()) / (1000 * 60 * 60 * 24))} days`}
              </p>
            </div>
            <span className={`font-bold ${item.is_paid ? 'text-gray-400' : 'text-gray-900'}`}>
              -R{item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="e.g. Taxi fare, Groceries"
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
          <label className="text-xs text-gray-600 whitespace-nowrap">Due in (days):</label>
          <input
            type="number"
            value={dueDays}
            onChange={(e) => setDueDays(e.target.value)}
            className="w-20 p-2 text-sm bg-white rounded-lg border border-gray-300 text-center"
          />
          <button
            type="submit"
            className="flex-1 bg-gray-900 text-white text-sm font-semibold py-2 px-4 rounded-lg active:scale-95 transition-transform"
          >
            Add Essential
          </button>
        </div>
      </form>
    </div>
  );
}