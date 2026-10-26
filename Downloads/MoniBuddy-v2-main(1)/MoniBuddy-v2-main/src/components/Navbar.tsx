import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Volume2, VolumeX, ShieldCheck, Globe, WifiOff, Mic, LogOut, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenAudioGuideModal: () => void;
  onOpenVoiceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAudioGuideModal, onOpenVoiceModal }) => {
  const {
    currentUser,
    logout,
    language,
    setLanguage,
    largeText,
    toggleLargeText,
    isOnline,
    isLedgerEncrypted,
    isSpeaking,
    stopSpeaking,
    t
  } = useApp();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zu', label: 'isiZulu' },
    { code: 'xh', label: 'isiXhosa' },
    { code: 'st', label: 'Sesotho' },
    { code: 'af', label: 'Afrikaans' }
  ];

  return (
    <header className="shrink-0 z-30 w-full border-b border-slate-200 bg-white">
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-amber-600 px-3 py-1.5 text-center text-xs font-semibold text-white flex items-center justify-center gap-1.5"
        >
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.offlineBanner}</span>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 py-2.5">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 truncate">
                {t.appName}
              </span>
              {isLedgerEncrypted && (
                <span
                  title={t.encryptedAesBadge}
                  className="hidden lg:inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                >
                  <Lock className="h-3 w-3" />
                  <span>{t.encryptedAesBadge}</span>
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-500 font-medium truncate">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Voice / Touch Log Quick Button */}
          <button
            type="button"
            onClick={onOpenVoiceModal}
            aria-label={t.voiceNavBtn}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Mic className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t.voiceNavBtn}</span>
          </button>

          {/* Audio Guide Button */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                onOpenAudioGuideModal();
              }
            }}
            aria-label={isSpeaking ? t.audioGuideActive : t.audioGuide}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{t.audioGuideActive}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{t.audioGuide}</span>
              </>
            )}
          </button>

          {/* Large Text Accessibility Toggle (A+) */}
          <button
            type="button"
            onClick={toggleLargeText}
            aria-pressed={largeText}
            title={t.largeTextTitle}
            aria-label={t.largeTextTitle}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border px-2.5 py-2 text-xs font-extrabold transition-colors ${
              largeText
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t.largeTextLabel}
          </button>

          {/* Language Selector */}
          <div className="relative flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-500 mr-1.5 shrink-0" />
            <select
              aria-label={t.languageLabel}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Account Pill & Sign Out */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 pl-2.5 pr-1.5 py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                {currentUser.name.trim().charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[96px] truncate text-xs font-bold text-slate-800">
                {currentUser.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                title={t.lockAndSignOut}
                aria-label={t.lockAndSignOut}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
