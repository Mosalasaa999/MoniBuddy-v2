import React from 'react';
import { Wallet, ArrowLeftRight, ShieldCheck, AlertTriangle, Menu } from 'lucide-react';
import { TabType } from '../types';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenMoreMenu
}) => {
  const { t } = useApp();

  const items: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t.navShortPots, icon: Wallet },
    { id: 'income_expenses', label: t.navShortCash, icon: ArrowLeftRight },
    { id: 'buffer_credit', label: t.navShortLoan, icon: ShieldCheck },
    { id: 'scam_guard', label: t.navShortScam, icon: AlertTriangle }
  ];

  const isSecondaryActive =
    currentTab === 'sync_2g' ||
    currentTab === 'technical_brief' ||
    currentTab === 'privacy_legal';

  return (
    <nav
      aria-label={t.myMoneySection}
      className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white md:hidden"
    >
      <div className="grid grid-cols-5 items-stretch">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-emerald-50/70 text-emerald-800 border-t-2 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? 'text-emerald-700' : 'text-slate-500'
                }`}
              />
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenMoreMenu}
          aria-label={t.moreMenu}
          className={`flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-xs font-semibold transition-colors ${
            isSecondaryActive
              ? 'bg-emerald-50/70 text-emerald-800 border-t-2 border-emerald-600'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Menu
            className={`h-5 w-5 shrink-0 ${
              isSecondaryActive ? 'text-emerald-700' : 'text-slate-500'
            }`}
          />
          <span className="truncate max-w-full">{t.moreMenu}</span>
        </button>
      </div>
    </nav>
  );
};
