import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Check,
  RotateCcw,
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Loader2,
  Download,
  Info
} from 'lucide-react';
import {
  VoiceRecognitionLanguage,
  SpeechTier,
  WasmVoicePackSnapshot,
  ConnectionProfile,
  VoicePackNeededError,
  Tier4FallbackError,
  wasmVoicePackManager,
  getConnectionProfile,
  getNetworkInformation,
  resolveActiveSpeechTier,
  startProgressiveSpeechCapture,
  ProgressiveSpeechSession
} from '../VoiceRecorder';
import {
  PHONETIC_ALIAS_MATRIX,
  ParsedVoiceEntry,
  parseVernacularTransaction
} from '../SlangDictionary';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { OfflineVoicePackModal } from './OfflineVoicePackModal';
import { Tier4TouchPad } from './Tier4TouchPad';

interface VoiceCapturePanelProps {
  selectedDate: string;
  onPopulateManualForm?: (entry: ParsedVoiceEntry) => void;
}

const LANGUAGE_OPTIONS: { code: VoiceRecognitionLanguage; label: string }[] = [
  { code: 'en-ZA', label: 'English (SA)' },
  { code: 'zu-ZA', label: 'isiZulu' },
  { code: 'xh-ZA', label: 'isiXhosa' },
  { code: 'st-ZA', label: 'Sesotho' },
  { code: 'af-ZA', label: 'Afrikaans' },
  { code: 'nso-ZA', label: 'Sepedi' }
];

const mapUiLangToVoiceLang = (lang: Language): VoiceRecognitionLanguage => {
  switch (lang) {
    case 'zu':
      return 'zu-ZA';
    case 'xh':
      return 'xh-ZA';
    case 'st':
      return 'st-ZA';
    case 'af':
      return 'af-ZA';
    default:
      return 'en-ZA';
  }
};

export const VoiceCapturePanel: React.FC<VoiceCapturePanelProps> = ({
  selectedDate,
  onPopulateManualForm
}) => {
  const { addTransaction, language, networkMode, t } = useApp();

  const [captureMode, setCaptureMode] = useState<'voice' | 'touch'>('voice');
  const [voiceLang, setVoiceLang] = useState<VoiceRecognitionLanguage>(() =>
    mapUiLangToVoiceLang(language)
  );

  useEffect(() => {
    setVoiceLang(mapUiLangToVoiceLang(language));
  }, [language]);

  const [packState, setPackState] = useState<WasmVoicePackSnapshot>(() =>
    wasmVoicePackManager.getSnapshot()
  );
  const [connectionProfile, setConnectionProfile] = useState<ConnectionProfile>(() =>
    getConnectionProfile(networkMode)
  );
  const [activeTier, setActiveTier] = useState<SpeechTier>(() =>
    resolveActiveSpeechTier(networkMode, wasmVoicePackManager.getSnapshot().status)
  );

  const [isListening, setIsListening] = useState(false);
  const [isTranscribingOffline, setIsTranscribingOffline] = useState(false);
  const [rawTranscript, setRawTranscript] = useState('');
  const [parsedEntries, setParsedEntries] = useState<ParsedVoiceEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [touchFallbackNotice, setTouchFallbackNotice] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [showSlangGuide, setShowSlangGuide] = useState(false);
  const [isVoicePackModalOpen, setIsVoicePackModalOpen] = useState(false);

  const sessionRef = useRef<ProgressiveSpeechSession | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    wasmVoicePackManager.evaluateAutoWifiPrefetch(networkMode);
    setConnectionProfile(getConnectionProfile(networkMode));
    setActiveTier(
      resolveActiveSpeechTier(networkMode, wasmVoicePackManager.getSnapshot().status)
    );
  }, [networkMode]);

  useEffect(() => {
    const unsubscribe = wasmVoicePackManager.subscribe((snapshot) => {
      setPackState(snapshot);
      setActiveTier(resolveActiveSpeechTier(networkMode, snapshot.status));
    });

    const handleConnectionChange = () => {
      setConnectionProfile(getConnectionProfile(networkMode));
      wasmVoicePackManager.evaluateAutoWifiPrefetch(networkMode);
      setActiveTier(
        resolveActiveSpeechTier(networkMode, wasmVoicePackManager.getSnapshot().status)
      );
    };

    const conn = getNetworkInformation();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    conn?.addEventListener?.('change', handleConnectionChange);

    return () => {
      unsubscribe();
      abortControllerRef.current?.abort();
      sessionRef.current?.cancel();
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      conn?.removeEventListener?.('change', handleConnectionChange);
    };
  }, [networkMode]);

  const evaluatePhrase = (phrase: string) => {
    setRawTranscript(phrase);
    setErrorMsg(null);
    setSavedToast(null);

    if (!phrase.trim()) {
      setParsedEntries([]);
      return;
    }

    const parsed = parseVernacularTransaction(phrase);
    setParsedEntries(parsed.entries);
    if (parsed.entries.length === 0) {
      setErrorMsg(t.noAmountParsedError);
    }
  };

  const handleToggleListening = async () => {
    if (isListening) {
      if (activeTier === 'tier3-wasm') {
        setIsTranscribingOffline(true);
      }
      sessionRef.current?.stopRecording();
      return;
    }

    setErrorMsg(null);
    setSavedToast(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const session = startProgressiveSpeechCapture({
      language: voiceLang,
      networkMode,
      signal: abortController.signal,
      onTierChange: (tier) => {
        setActiveTier(tier);
      },
      onTranscribing: () => {
        setIsTranscribingOffline(true);
      }
    });

    sessionRef.current = session;
    setActiveTier(session.activeTier);
    setIsListening(true);

    try {
      const { transcript } = await session.result;
      setIsListening(false);
      setIsTranscribingOffline(false);
      const combined = rawTranscript ? `${rawTranscript}, ${transcript}` : transcript;
      evaluatePhrase(combined);
    } catch (err) {
      setIsListening(false);
      setIsTranscribingOffline(false);

      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      if (err instanceof VoicePackNeededError) {
        setIsVoicePackModalOpen(true);
        return;
      }

      if (err instanceof Tier4FallbackError) {
        setTouchFallbackNotice(err.message);
        setCaptureMode('touch');
        return;
      }

      setErrorMsg(err instanceof Error ? err.message : t.voiceNetworkLimitationNote);
    }
  };

  const handleAppendTouchEntry = (entry: ParsedVoiceEntry) => {
    setErrorMsg(null);
    setSavedToast(null);
    setParsedEntries((prev) => [...prev, entry]);
  };

  const handleConfirmAll = () => {
    if (parsedEntries.length === 0) return;

    parsedEntries.forEach((entry) => {
      addTransaction({
        title: entry.title,
        amount: entry.amount,
        type: entry.type,
        category: entry.category,
        date: selectedDate
      });
    });

    const count = parsedEntries.length;
    setParsedEntries([]);
    setRawTranscript('');
    setSavedToast(`${t.savedEntriesNoticePrefix} (${count})`);
  };

  const handleReset = () => {
    abortControllerRef.current?.abort();
    sessionRef.current?.cancel();
    setIsListening(false);
    setIsTranscribingOffline(false);
    setRawTranscript('');
    setParsedEntries([]);
    setErrorMsg(null);
    setSavedToast(null);
  };

  const handleRemoveEntry = (idx: number) => {
    setParsedEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatZAR = (val: number) =>
    `R ${val.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  const renderModeBadge = () => {
    if (captureMode === 'touch') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
          {t.modeTouchActive}
        </span>
      );
    }
    switch (activeTier) {
      case 'tier1-cloud':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900">
            {t.modeCloudSpeech}
          </span>
        );
      case 'tier2-ondevice':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-900">
            {t.modeOnDeviceSpeech}
          </span>
        );
      case 'tier3-wasm':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-900">
            {packState.status === 'ready'
              ? t.modeOfflineSpeechReady
              : t.modeOfflinePackAvailable}
          </span>
        );
      case 'tier4-touch':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            {t.modeTouchActive}
          </span>
        );
    }
  };

  const renderPackStatusTag = () => {
    if (packState.status === 'ready') {
      return (
        <span className="text-xs font-semibold text-emerald-700">
          {t.packSavedStatus}
        </span>
      );
    }
    if (packState.status === 'downloading') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
          <Loader2 className="h-3 w-3 animate-spin" />
          {t.packSavingPrefix} ({packState.progress}%)
        </span>
      );
    }
    if (packState.status === 'queued-wifi') {
      return (
        <span className="text-xs font-semibold text-amber-700">
          {t.packWaitingWifi}
        </span>
      );
    }
    return (
      <span className="text-xs font-medium text-slate-500">
        {t.packDataProtected}
      </span>
    );
  };

  const currencySlangItems = PHONETIC_ALIAS_MATRIX.filter(
    (item) => typeof item.amount === 'number'
  );

  return (
    <section
      aria-label={t.quickVoiceTouchTitle}
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5"
    >
      {/* Top Bar: Title, Mode Switcher, Language */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {t.quickVoiceTouchTitle}
            </h2>
            {renderModeBadge()}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {renderPackStatusTag()}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Voice vs Touch Pad Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setCaptureMode('voice');
                setTouchFallbackNotice(null);
              }}
              className={`min-h-[40px] flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                captureMode === 'voice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>{t.voiceTabLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setCaptureMode('touch')}
              className={`min-h-[40px] flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                captureMode === 'touch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              <span>{t.touchPadTabLabel}</span>
            </button>
          </div>

          {captureMode === 'voice' && (
            <select
              id="voice-lang-select"
              aria-label={t.languageLabel}
              value={voiceLang}
              onChange={(e) =>
                setVoiceLang(e.target.value as VoiceRecognitionLanguage)
              }
              className="min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Split: Capture Surface vs Verification Card */}
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 space-y-3">
          {captureMode === 'touch' ? (
            <Tier4TouchPad
              onAddEntry={handleAppendTouchEntry}
              fallbackNotice={touchFallbackNotice}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  disabled={isTranscribingOffline}
                  className={`min-h-[48px] flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all cursor-pointer disabled:opacity-60 ${
                    isListening
                      ? 'bg-rose-600 text-white hover:bg-rose-700 ring-4 ring-rose-100'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs'
                  }`}
                >
                  {isTranscribingOffline ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.transcribingOfflineMsg}</span>
                    </>
                  ) : isListening ? (
                    <>
                      <Square className="h-4 w-4 fill-current" />
                      <span>
                        {activeTier === 'tier3-wasm'
                          ? t.doneSpeakingBtn
                          : t.stopListeningBtn}
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      <span>{t.speakTransactionBtn}</span>
                    </>
                  )}
                </button>

                {packState.status !== 'ready' && (
                  <button
                    type="button"
                    onClick={() => setIsVoicePackModalOpen(true)}
                    className="min-h-[48px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>
                      {packState.status === 'downloading'
                        ? `${t.downloadingProgressPrefix} ${packState.progress}%`
                        : t.offlineVoicePackBtn}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowSlangGuide((prev) => !prev)}
                  className="min-h-[48px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    {showSlangGuide ? t.slangGuideHide : t.slangGuideShow}
                  </span>
                  {showSlangGuide ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>
              </div>

              {isListening && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-950 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="font-medium">{t.listeningOfflineHint}</span>
                </div>
              )}

              {/* Editable Phrase Box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="vernacular-phrase-input"
                    className="text-xs font-semibold text-slate-700"
                  >
                    {t.spokenPhraseLabel}
                  </label>
                  {rawTranscript && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {t.clear}
                    </button>
                  )}
                </div>
                <input
                  id="vernacular-phrase-input"
                  type="text"
                  value={rawTranscript}
                  onChange={(e) => evaluatePhrase(e.target.value)}
                  placeholder={t.spokenPhrasePlaceholder}
                  className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Honest Network / Offline Speech Limitation Note */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{t.voiceNetworkLimitationNote}</span>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900 flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCaptureMode('touch')}
                    className="shrink-0 font-bold text-amber-950 underline hover:no-underline"
                  >
                    {t.openTouchPadBtn}
                  </button>
                </div>
              )}

              {savedToast && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-900 flex items-center gap-2"
                >
                  <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>{savedToast}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Confirmation Preview Card */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t.entriesReadyTitle}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600">
              {parsedEntries.length}
            </span>
          </div>

          {parsedEntries.length === 0 ? (
            <div className="space-y-2 py-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {captureMode === 'touch'
                  ? t.emptyPreviewTouchHint
                  : t.emptyPreviewVoiceHint}
              </p>
              {savedToast && captureMode === 'touch' && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>{savedToast}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200/80 rounded-lg border border-slate-200 bg-white">
                {parsedEntries.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block h-2 w-2 rounded-full shrink-0 ${
                            item.type === 'income'
                              ? 'bg-emerald-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.category} · {selectedDate}
                        {item.tags.length > 0 && (
                          <span className="ml-1 text-emerald-800 font-medium">
                            ({t.recognizedSlangPrefix} {item.tags.join(', ')})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-sm font-extrabold font-mono tabular-nums ${
                          item.type === 'income'
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {item.type === 'income' ? '+' : '-'}{' '}
                        {formatZAR(item.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEntry(idx)}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 px-1.5 py-1"
                        title={t.remove}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmAll}
                  className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    {t.saveEntriesBtnPrefix} ({parsedEntries.length}){' '}
                    {t.saveEntriesBtnSuffix}
                  </span>
                </button>

                {parsedEntries.length === 1 && onPopulateManualForm && (
                  <button
                    type="button"
                    onClick={() => onPopulateManualForm(parsedEntries[0])}
                    className="min-h-[46px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    {t.editInFormBtn}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collapsible Slang Reference Table */}
      {showSlangGuide && captureMode === 'voice' && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-700 mb-2.5">
            {t.slangGuideHeading}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {currencySlangItems.map((item) => (
              <div
                key={item.term}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 capitalize">
                    “{item.term}”
                  </span>
                  <span className="text-xs font-extrabold font-mono text-emerald-800 tabular-nums">
                    R {item.amount}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  {item.aliases.slice(0, 4).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cellular Data Protection Modal */}
      <OfflineVoicePackModal
        isOpen={isVoicePackModalOpen}
        onClose={() => setIsVoicePackModalOpen(false)}
        packState={packState}
        connectionProfile={connectionProfile}
        onDownloadNow={() => {
          wasmVoicePackManager
            .downloadVoicePack()
            .then(() => {
              setIsVoicePackModalOpen(false);
            })
            .catch(() => {});
        }}
        onCancelDownload={() => {
          wasmVoicePackManager.cancelDownload();
        }}
        onDownloadLaterOnWifi={() => {
          wasmVoicePackManager.queueForWifi();
          setIsVoicePackModalOpen(false);
          setCaptureMode('touch');
        }}
        onUseManualTouchPad={() => {
          setIsVoicePackModalOpen(false);
          setCaptureMode('touch');
        }}
      />
    </section>
  );
};
