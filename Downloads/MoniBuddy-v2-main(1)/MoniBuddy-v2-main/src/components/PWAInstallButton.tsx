import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccessibleModal } from './AccessibleModal';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstallButton: React.FC = () => {
  const { t } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (deferredPrompt) {
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>{t.pwaInstallOfflineApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
        >
          <Download className="h-4 w-4 shrink-0" />
          <span>{t.pwaInstallOnIphone}</span>
        </button>

        <AccessibleModal
          isOpen={showIOSGuide}
          onClose={() => setShowIOSGuide(false)}
          labelledBy="pwa-ios-guide-title"
          maxWidthClass="max-w-sm"
        >
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3
                id="pwa-ios-guide-title"
                className="text-sm font-bold text-slate-900"
              >
                {t.pwaIosGuideTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label={t.close}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <Share className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>1. {t.pwaIosStep1}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PlusSquare className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>2. {t.pwaIosStep2}</span>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[44px] rounded-xl bg-slate-900 py-2 text-xs font-bold text-white"
            >
              {t.pwaGotIt}
            </button>
          </div>
        </AccessibleModal>
      </>
    );
  }

  return null;
};
