import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Wallet,
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  Signal,
  BookOpen,
  Scale,
  X,
  CheckCircle2,
  LogOut,
  Lock
} from 'lucide-react';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen
}) => {
  const {
    t,
    isOnline,
    isLedgerEncrypted,
    lastSavedAt,
    currentUser,
    logout
  } = useApp();

  const mainNavItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t.navOverview, icon: Wallet },
    { id: 'income_expenses', label: t.navIncomeExpenses, icon: ArrowLeftRight },
    { id: 'buffer_credit', label: t.navBufferCredit, icon: ShieldCheck },
    { id: 'scam_guard', label: t.navScamGuard, icon: AlertTriangle },
    { id: 'sync_2g', label: t.nav2gSync, icon: Signal }
  ];

  const docNavItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'technical_brief', label: t.navTechnicalBrief, icon: BookOpen },
    { id: 'privacy_legal', label: t.navPrivacyLegal, icon: Scale }
  ];

  const handleSelect = (id: TabType) => {
    setCurrentTab(id);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">{t.moreMenu}</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={t.close}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {t.myMoneySection}
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {t.guidePrivacySection}
          </p>
          <nav className="space-y-1">
            {docNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Encryption & Offline Guarantee Card */}
      <div className="mt-6 space-y-2.5">
        <PWAInstallButton />
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CheckCircle2
              className={`h-4 w-4 shrink-0 ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`}
            />
            <span>{isOnline ? t.localLedgerActive : t.offlineSavedOnPhone}</span>
          </div>
          {isLedgerEncrypted && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>{t.encryptedAesBadge}</span>
            </div>
          )}
          {lastSavedAt && (
            <p className="mt-1.5 text-xs text-slate-500">
              {t.savedAtPrefix} {lastSavedAt}
            </p>
          )}
        </div>

        {currentUser && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.signedInAs}
                </p>
                <p className="truncate text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="truncate font-mono text-xs text-slate-500">{currentUser.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                aria-label={t.lockAndSignOut}
                className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t.close}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/65"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-white h-full shadow-2xl overflow-y-auto">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
