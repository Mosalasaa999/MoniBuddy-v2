// Cash Widget 
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function CurrentCashWidget() {
  const { user, updateCash } = useAppStore();
  const [val, setVal] = useState(user?.current_cash?.toString() || '0');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setVal(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      updateCash(parsed);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <label htmlFor="current-cash" className="block text-sm font-medium text-gray-600 mb-2">
        Physical Cash & Available Balance
      </label>
      <div className="relative rounded-xl shadow-inner bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold text-lg pointer-events-none">
          R
        </span>
        <input
          id="current-cash"
          type="number"
          inputMode="decimal"
          value={val}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full pl-9 pr-4 py-3 bg-transparent text-2xl font-bold text-gray-900 focus:outline-none"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">Saved strictly offline on this device.</p>
    </div>
  );
}