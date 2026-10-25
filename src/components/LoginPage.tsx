import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  ShieldCheck,
  Lock,
  Phone,
  User as UserIcon,
  Mail,
  ArrowRight,
  WifiOff,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Volume2,
  VolumeX
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    register,
    loginWithGoogle,
    hasRegisteredAccounts,
    rememberedIdentifier,
    language,
    setLanguage,
    largeText,
    toggleLargeText,
    isOnline,
    isSpeaking,
    speakText,
    stopSpeaking,
    t
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>(() =>
    hasRegisteredAccounts ? 'signin' : 'register'
  );

  // Sign In fields — prefill ONLY from explicitly remembered phone/email (never demo credentials)
  const [signInIdentifier, setSignInIdentifier] = useState<string>(() => rememberedIdentifier || '');
  const [signInPin, setSignInPin] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showSignInPin, setShowSignInPin] = useState<boolean>(false);

  // Register fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [createPin, setCreatePin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [showRegisterPin, setShowRegisterPin] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lockedCountdown, setLockedCountdown] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Google Details Registration Modal states
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [googleEmailVal, setGoogleEmailVal] = useState<string>('');
  const [googleNameVal, setGoogleNameVal] = useState<string>('');
  const [googlePhoneVal, setGooglePhoneVal] = useState<string>('');
  const [googlePinVal, setGooglePinVal] = useState<string>('');
  const [googleConfirmPinVal, setGoogleConfirmPinVal] = useState<string>('');
  const [googleModalError, setGoogleModalError] = useState<string>('');

  useEffect(() => {
    if (lockedCountdown <= 0) return;
    const timer = window.setInterval(() => {
      setLockedCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lockedCountdown]);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zu', label: 'isiZulu' },
    { code: 'xh', label: 'isiXhosa' },
    { code: 'st', label: 'Sesotho' },
    { code: 'af', label: 'Afrikaans' }
  ];

  const handleModeSwitch = (nextMode: 'signin' | 'register') => {
    setMode(nextMode);
    setErrorMessage('');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (isSubmitting || lockedCountdown > 0) return;

    setIsSubmitting(true);
    try {
      const result = await login(signInIdentifier, signInPin, rememberMe);
      if (!result.success) {
        if (result.lockedSeconds && result.lockedSeconds > 0) {
          setLockedCountdown(result.lockedSeconds);
        }
        setErrorMessage(result.message || t.authErrIncorrectCredentials);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (createPin !== confirmPin) {
      setErrorMessage(t.authErrPinMismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(fullName, phone, createPin, email);
      if (!result.success) {
        setErrorMessage(result.message || t.authErrInvalidPhone);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAudioExplain = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const prompt = mode === 'signin' ? t.authAudioSignIn : t.authAudioRegister;
    speakText(prompt);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Offline Banner */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-amber-600 px-4 py-1.5 text-center text-xs font-semibold text-white flex items-center justify-center gap-1.5"
        >
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                {t.appName}
              </span>
              <p className="hidden sm:block text-xs font-medium text-slate-500">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAudioExplain}
              aria-label={isSpeaking ? t.stopAudio : t.listen}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                isSpeaking
                  ? 'bg-amber-500 text-white'
                  : 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4 shrink-0" />
                  <span>{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 shrink-0" />
                  <span>{t.listen}</span>
                </>
              )}
            </button>

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

            <div className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-500 mr-1.5 shrink-0" />
              <select
                aria-label={t.languageLabel}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <Lock className="h-3.5 w-3.5" />
              <span>{t.authHeroBadge}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {t.tagline}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.authHeroBody}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {t.authFeature1Title}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    {t.authFeature1Body}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {t.authFeature2Title}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    {t.authFeature2Body}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {t.authFeature3Title}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    {t.authFeature3Body}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">
              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 mb-6">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.authSignInTab}
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.authRegisterTab}
                </button>
              </div>

              {/* Google Sign-In & Cloud Backup Option */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setGoogleModalError('');
                    setGoogleEmailVal('');
                    setGoogleNameVal('');
                    setGooglePhoneVal('');
                    setGooglePinVal('');
                    setGoogleConfirmPinVal('');
                    setShowGoogleModal(true);
                  }}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 min-h-[48px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50"
                  testTag="google_login_button"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.17 21.36 7.22 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.4l4.08-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.64 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
                  </svg>
                  <span>{t.authGoogleButton}</span>
                </button>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-slate-200"></div>
                  <span className="px-3 text-xs font-semibold text-slate-400 uppercase">or</span>
                  <div className="flex-1 border-t border-slate-200"></div>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {mode === 'signin' ? t.authSignInTitle : t.authRegisterTitle}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  {mode === 'signin' ? t.authSignInSubtitle : t.authRegisterSubtitle}
                </p>
              </div>

              {mode === 'signin' && !hasRegisteredAccounts && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-900 flex items-center justify-between gap-2">
                  <span>{t.authNoAccountYet}</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-amber-900 underline shrink-0"
                  >
                    {t.authCreateOneLink}
                  </button>
                </div>
              )}

              {(errorMessage || lockedCountdown > 0) && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-800"
                >
                  {lockedCountdown > 0
                    ? `${t.authErrPinLockedPrefix} ${lockedCountdown}${t.authErrPinLockedSuffix}`
                    : errorMessage}
                </div>
              )}

              {mode === 'signin' ? (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="signin-identifier"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      {t.authMobileOrEmailLabel}
                    </label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signin-identifier"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        autoComplete="tel"
                        required
                        value={signInIdentifier}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setSignInIdentifier(digitsOnly);
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'ArrowLeft' ||
                            e.key === 'ArrowRight' ||
                            e.key === 'Enter' ||
                            e.ctrlKey ||
                            e.metaKey
                          ) {
                            return;
                          }
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 10);
                          setSignInIdentifier(pasted);
                        }}
                        placeholder="0721234567"
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="signin-pin"
                        className="block text-xs font-bold text-slate-700"
                      >
                        {t.authPinLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSignInPin((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        {showSignInPin ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>{t.authHidePin}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t.authShowPin}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signin-pin"
                        type={showSignInPin ? 'text' : 'password'}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoComplete="current-password"
                        required
                        value={signInPin}
                        onChange={(e) =>
                          setSignInPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        placeholder={t.authPinPlaceholder}
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-xs font-medium text-slate-600">
                      {t.authRememberPhone}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || lockedCountdown > 0}
                    className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting ? t.authUnlockingButton : t.authUnlockButton}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      {t.authFullNameLabel}
                    </label>
                    <div className="relative">
                      <UserIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t.authFullNamePlaceholder}
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      {t.authMobileLabel}
                    </label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(digitsOnly);
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'ArrowLeft' ||
                            e.key === 'ArrowRight' ||
                            e.key === 'Enter' ||
                            e.ctrlKey ||
                            e.metaKey
                          ) {
                            return;
                          }
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 10);
                          setPhone(pasted);
                        }}
                        placeholder="0721234567"
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="reg-pin"
                          className="block text-xs font-bold text-slate-700"
                        >
                          {t.authCreatePinLabel}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowRegisterPin((prev) => !prev)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          {showRegisterPin ? t.authHidePin : t.authShowPin}
                        </button>
                      </div>
                      <input
                        id="reg-pin"
                        type={showRegisterPin ? 'text' : 'password'}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoComplete="new-password"
                        required
                        value={createPin}
                        onChange={(e) =>
                          setCreatePin(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        placeholder="4–6"
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono tracking-widest text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reg-confirm-pin"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        {t.authConfirmPinLabel}
                      </label>
                      <input
                        id="reg-confirm-pin"
                        type={showRegisterPin ? 'text' : 'password'}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoComplete="new-password"
                        required
                        value={confirmPin}
                        onChange={(e) =>
                          setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        placeholder="4–6"
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono tracking-widest text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      {t.authEmailOptionalLabel}
                    </label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.authEmailOptionalPlaceholder}
                        className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting ? t.authCreatingButton : t.authCreateAccountButton}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* Security Guarantee Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
                <Lock className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>{t.authFooterGuarantee}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>{t.authFooterLeft}</span>
          <span>{t.authFooterRight}</span>
        </div>
      </footer>

      {/* Google Details & Offline Setup Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {t.googleDetailsModalTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.googleDetailsModalSubtitle}
                </p>
              </div>
            </div>

            {googleModalError && (
              <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
                {googleModalError}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setGoogleModalError('');
                if (googlePinVal !== googleConfirmPinVal) {
                  setGoogleModalError(t.authErrPinMismatch);
                  return;
                }
                setIsSubmitting(true);
                try {
                  const res = await loginWithGoogle(
                    googleEmailVal,
                    googleNameVal,
                    googlePhoneVal,
                    googlePinVal
                  );
                  if (res.success) {
                    setShowGoogleModal(false);
                  } else {
                    setGoogleModalError(res.message || t.googleLoginError);
                  }
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.googleDetailsEmailLabel}
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={googleEmailVal}
                    onChange={(e) => setGoogleEmailVal(e.target.value)}
                    placeholder="user@gmail.com"
                    aria-label={t.googleDetailsEmailLabel}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    data-testid="google_email_input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.googleDetailsNameLabel}
                </label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={googleNameVal}
                    onChange={(e) => setGoogleNameVal(e.target.value)}
                    placeholder="Sipho Dlamini"
                    aria-label={t.googleDetailsNameLabel}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    data-testid="google_name_input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.googleDetailsPhoneLabel}
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={googlePhoneVal}
                    onChange={(e) => setGooglePhoneVal(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="0721234567"
                    aria-label={t.googleDetailsPhoneLabel}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    data-testid="google_phone_input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.googleDetailsPinLabel}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={googlePinVal}
                    onChange={(e) => setGooglePinVal(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="1234"
                    aria-label={t.googleDetailsPinLabel}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-mono tracking-widest text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    data-testid="google_pin_input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.googleDetailsConfirmPinLabel}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={googleConfirmPinVal}
                    onChange={(e) => setGoogleConfirmPinVal(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="1234"
                    aria-label={t.googleDetailsConfirmPinLabel}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-mono tracking-widest text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 min-h-[44px] rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
                  data-testid="google_submit_button"
                >
                  {isSubmitting ? t.authUnlockingButton : t.googleDetailsSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
