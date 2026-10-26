import React, { useState } from 'react';
import {
  Bus,
  ShoppingBag,
  Zap,
  Smartphone,
  Briefcase,
  Users,
  TrendingUp,
  HandCoins,
  Delete,
  Plus,
  RotateCcw
} from 'lucide-react';
import { ParsedVoiceEntry } from '../SlangDictionary';
import { useApp } from '../context/AppContext';

interface Tier4TouchPadProps {
  onAddEntry: (entry: ParsedVoiceEntry) => void;
  fallbackNotice?: string | null;
}

interface CategoryTile {
  id: string;
  label: string;
  category: string;
  defaultTitle: string;
  type: 'expense' | 'income';
  icon: React.ReactNode;
}

interface SlangDenominationButton {
  slang: string;
  amount: number;
}

const SLANG_DENOMINATIONS: readonly SlangDenominationButton[] = [
  { slang: 'Half Tiger', amount: 5 },
  { slang: 'Tiger', amount: 10 },
  { slang: 'Choco', amount: 20 },
  { slang: 'Pinkies', amount: 50 },
  { slang: 'Clipa', amount: 100 },
  { slang: 'Leopard', amount: 200 }
];

const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'] as const;

export const Tier4TouchPad: React.FC<Tier4TouchPadProps> = ({
  onAddEntry,
  fallbackNotice
}) => {
  const { t } = useApp();

  const categoryTiles: CategoryTile[] = [
    {
      id: 'taxi',
      label: t.presetTaxi,
      category: 'Transport',
      defaultTitle: t.presetTaxi,
      type: 'expense',
      icon: <Bus className="h-4 w-4 text-amber-700" />
    },
    {
      id: 'groceries',
      label: t.presetGroceries,
      category: 'Groceries',
      defaultTitle: t.presetGroceries,
      type: 'expense',
      icon: <ShoppingBag className="h-4 w-4 text-emerald-700" />
    },
    {
      id: 'electricity',
      label: t.presetElectricity,
      category: 'Utilities',
      defaultTitle: t.presetElectricity,
      type: 'expense',
      icon: <Zap className="h-4 w-4 text-yellow-700" />
    },
    {
      id: 'airtime',
      label: t.presetAirtime,
      category: 'Connectivity',
      defaultTitle: t.presetAirtime,
      type: 'expense',
      icon: <Smartphone className="h-4 w-4 text-blue-700" />
    },
    {
      id: 'stock',
      label: t.presetSpaza,
      category: 'Inventory',
      defaultTitle: t.presetSpaza,
      type: 'expense',
      icon: <Briefcase className="h-4 w-4 text-purple-700" />
    },
    {
      id: 'wages',
      label: t.presetWages,
      category: 'Wages',
      defaultTitle: t.presetWages,
      type: 'income',
      icon: <HandCoins className="h-4 w-4 text-emerald-700" />
    },
    {
      id: 'sales',
      label: t.presetHustle,
      category: 'Sales',
      defaultTitle: t.presetHustle,
      type: 'income',
      icon: <TrendingUp className="h-4 w-4 text-emerald-700" />
    },
    {
      id: 'grant',
      label: t.presetGrant,
      category: 'Support',
      defaultTitle: t.presetGrant,
      type: 'income',
      icon: <Users className="h-4 w-4 text-teal-700" />
    }
  ];

  const [selectedTileId, setSelectedTileId] = useState<string>(categoryTiles[0].id);
  const [amountStr, setAmountStr] = useState<string>('0');
  const [matchedSlang, setMatchedSlang] = useState<string[]>([]);

  const selectedTile =
    categoryTiles.find((tile) => tile.id === selectedTileId) ?? categoryTiles[0];

  const numericAmount = parseFloat(amountStr) || 0;

  const handleSlangTap = (btn: SlangDenominationButton) => {
    const next = Math.round((numericAmount + btn.amount) * 100) / 100;
    setAmountStr(next % 1 === 0 ? String(next) : next.toFixed(2));
    setMatchedSlang((prev) =>
      prev.includes(`${btn.slang} (R${btn.amount})`)
        ? prev
        : [...prev, `${btn.slang} (R${btn.amount})`]
    );
  };

  const handleKeypadTap = (key: (typeof KEYPAD_KEYS)[number]) => {
    if (key === 'DEL') {
      setAmountStr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
      return;
    }

    if (key === '.') {
      setAmountStr((prev) => (prev.includes('.') ? prev : `${prev}.`));
      return;
    }

    setAmountStr((prev) => {
      if (prev === '0') return key;
      const parts = prev.split('.');
      if (parts[1] && parts[1].length >= 2) return prev;
      if (prev.length >= 8) return prev;
      return `${prev}${key}`;
    });
  };

  const handleClearAmount = () => {
    setAmountStr('0');
    setMatchedSlang([]);
  };

  const handleStageEntry = () => {
    if (numericAmount <= 0) return;

    onAddEntry({
      title: selectedTile.defaultTitle,
      amount: numericAmount,
      type: selectedTile.type,
      category: selectedTile.category,
      tags: matchedSlang
    });

    setAmountStr('0');
    setMatchedSlang([]);
  };

  const formatZAR = (val: number) =>
    `R ${val.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  return (
    <div className="space-y-4">
      {fallbackNotice && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950 font-medium">
          {fallbackNotice}
        </div>
      )}

      {/* 1. Category Icon Pad */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            {t.touchStep1Category}
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              selectedTile.type === 'income'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {selectedTile.type === 'income' ? t.moneyInBtn : t.moneyOutBtn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categoryTiles.map((tile) => {
            const isSelected = tile.id === selectedTile.id;
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => setSelectedTileId(tile.id)}
                className={`min-h-[48px] flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? tile.type === 'income'
                      ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-700/20'
                      : 'border-slate-900 bg-slate-100 ring-2 ring-slate-900/15'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="shrink-0">{tile.icon}</span>
                <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slang Quick-Tap Denominations */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            {t.touchStep2Slang}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {t.touchZeroTyping}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SLANG_DENOMINATIONS.map((btn) => (
            <button
              key={btn.slang}
              type="button"
              onClick={() => handleSlangTap(btn)}
              className="min-h-[52px] flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 active:scale-[0.98] px-2 py-1.5 transition-all cursor-pointer"
            >
              <span className="text-sm font-extrabold font-mono text-emerald-950 tabular-nums">
                +R{btn.amount}
              </span>
              <span className="text-xs font-semibold text-emerald-800 truncate max-w-full">
                {btn.slang}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live Display + Compact Numeric Keypad */}
      <div className="grid sm:grid-cols-12 gap-3 items-stretch">
        <div className="sm:col-span-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {selectedTile.defaultTitle}
              </span>
              {numericAmount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAmount}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  <RotateCcw className="h-3 w-3" />
                  {t.clear}
                </button>
              )}
            </div>

            <p
              className={`text-2xl font-extrabold font-mono tabular-nums mt-1.5 ${
                selectedTile.type === 'income'
                  ? 'text-emerald-800'
                  : 'text-slate-900'
              }`}
            >
              {formatZAR(numericAmount)}
            </p>
          </div>

          <button
            type="button"
            disabled={numericAmount <= 0}
            onClick={handleStageEntry}
            className="w-full min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>
              {numericAmount > 0
                ? `${t.touchAddItemPrefix} ${selectedTile.label} (${formatZAR(numericAmount)})`
                : t.touchTapAboveBtn}
            </span>
          </button>
        </div>

        {/* Numeric Keypad */}
        <div className="sm:col-span-7 grid grid-cols-3 gap-1.5">
          {KEYPAD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeypadTap(key)}
              aria-label={key === 'DEL' ? t.clear : key}
              className={`min-h-[44px] flex items-center justify-center rounded-xl border text-sm font-bold font-mono transition-colors cursor-pointer ${
                key === 'DEL'
                  ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100'
              }`}
            >
              {key === 'DEL' ? <Delete className="h-4 w-4" /> : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
