/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TabType, GoalPot } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PotsOverview } from './components/PotsOverview';
import { AudioGuideModal } from './components/AudioGuideModal';
import { NewPotModal, PotActionModal, BufferModal, VoiceCaptureModal } from './components/Modals';
import { LoginPage } from './components/LoginPage';

const IncomeExpenses = lazy(() =>
  import('./components/IncomeExpenses').then((m) => ({ default: m.IncomeExpenses }))
);
const BufferCredit = lazy(() =>
  import('./components/BufferCredit').then((m) => ({ default: m.BufferCredit }))
);
const ScamGuard = lazy(() =>
  import('./components/ScamGuard').then((m) => ({ default: m.ScamGuard }))
);
const Sync2G = lazy(() =>
  import('./components/Sync2G').then((m) => ({ default: m.Sync2G }))
);
const TechnicalBrief = lazy(() =>
  import('./components/TechnicalBrief').then((m) => ({ default: m.TechnicalBrief }))
);
const PrivacyLegal = lazy(() =>
  import('./components/PrivacyLegal').then((m) => ({ default: m.PrivacyLegal }))
);

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [audioGuideOpen, setAudioGuideOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [newPotModalOpen, setNewPotModalOpen] = useState<boolean>(false);
  const [bufferModalOpen, setBufferModalOpen] = useState<boolean>(false);
  const [potActionState, setPotActionState] = useState<{
    isOpen: boolean;
    pot: GoalPot | null;
    mode: 'deposit' | 'withdraw';
  }>({
    isOpen: false,
    pot: null,
    mode: 'deposit'
  });

  const handleOpenPotAction = (pot: GoalPot, mode: 'deposit' | 'withdraw') => {
    setPotActionState({
      isOpen: true,
      pot,
      mode
    });
  };

  return (
    <div className="h-screen w-full overflow-x-hidden overflow-y-hidden bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenAudioGuideModal={() => setAudioGuideOpen(true)}
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 min-h-0 flex max-w-7xl w-full mx-auto overflow-hidden">
        {/* Left Sidebar / Mobile More Drawer */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Scrollable Content Area (extra bottom padding for mobile thumb nav) */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 md:pb-8 lg:p-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600">
                ...
              </div>
            }
          >
            {currentTab === 'overview' && (
              <PotsOverview
                onOpenNewPotModal={() => setNewPotModalOpen(true)}
                onOpenBufferModal={() => setBufferModalOpen(true)}
                onSelectPotForAction={handleOpenPotAction}
              />
            )}

            {currentTab === 'income_expenses' && <IncomeExpenses />}

            {currentTab === 'buffer_credit' && (
              <BufferCredit onOpenBufferModal={() => setBufferModalOpen(true)} />
            )}

            {currentTab === 'scam_guard' && <ScamGuard />}

            {currentTab === 'sync_2g' && <Sync2G />}

            {currentTab === 'technical_brief' && <TechnicalBrief />}

            {currentTab === 'privacy_legal' && <PrivacyLegal />}
          </Suspense>
        </main>
      </div>

      {/* Thumb-Zone Mobile Bottom Tab Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenMoreMenu={() => setMobileSidebarOpen(true)}
      />

      {/* Global Modals */}
      <AudioGuideModal
        isOpen={audioGuideOpen}
        onClose={() => setAudioGuideOpen(false)}
        currentTab={currentTab}
      />

      <NewPotModal
        isOpen={newPotModalOpen}
        onClose={() => setNewPotModalOpen(false)}
      />

      <PotActionModal
        isOpen={potActionState.isOpen}
        pot={potActionState.pot}
        mode={potActionState.mode}
        onClose={() => setPotActionState((prev) => ({ ...prev, isOpen: false }))}
      />

      <BufferModal
        isOpen={bufferModalOpen}
        onClose={() => setBufferModalOpen(false)}
      />

      <VoiceCaptureModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
};

const RootNavigation: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}
