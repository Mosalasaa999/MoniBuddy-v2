// Web Speech API Wrapper 
// VoiceEntryCapture.tsx
import { useEffect, useRef, useState } from "react";
import ConfirmationScreen from "./ConfirmationScreen";
import { t } from "../../locales/dictionary";
import type { Locale } from "../../locales/dictionary";
type SpeechRecognitionResultItem = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: SpeechRecognitionResultItem;
  }>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export interface VoiceCaptureProps {
  locale: Locale;
  onSave: (verifiedText: string) => Promise<void> | void;
}

function extractRandAmount(text: string): number | null {
  const match = text.match(/(?:r|rand)?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:rand|zar|r)?/i);
  if (!match) return null;

  const normalized = match[1].replace(/\s/g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function previewLine(text: string) {
  const amount = extractRandAmount(text);
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (amount === null) return cleaned;
  return `${cleaned} — R${amount.toFixed(2).replace(/\.00$/, "")}`;
}

export default function VoiceCapture({ locale, onSave }: VoiceCaptureProps) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [heard, setHeard] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const copy = (key: Parameters<typeof t>[1]) => t(locale, key);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  function stopListening() {
    try {
      recognitionRef.current?.stop();
    } catch {
      // no-op
    } finally {
      recognitionRef.current = null;
      setListening(false);
    }
  }

  function startListening() {
    setError(null);
    setInterim("");
    setHeard("");
    setShowConfirm(false);

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setError(copy("voice.unsupported"));
      return;
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;

    recognition.lang = locale === "zu" ? "zu-ZA" : locale === "st" ? "st-ZA" : locale === "af" ? "af-ZA" : "en-ZA";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    setListening(true);

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let draft = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          draft += result[0].transcript;
        }
      }

      setInterim(draft);
      setHeard((finalTranscript || draft).trim());
    };

    recognition.onerror = (event) => {
      stopListening();
      setShowConfirm(false);

      if (event.error === "not-allowed") {
        setError(copy("voice.micBlocked"));
      } else if (event.error === "no-speech") {
        setError(copy("voice.noSpeech"));
      } else if (event.error === "network") {
        setError(copy("voice.network"));
      } else {
        setError(copy("voice.generic"));
      }
    };

    recognition.onend = () => {
      stopListening();

      const clean = finalTranscript.trim();
      if (!clean) {
        setError(copy("voice.noSpeech"));
        return;
      }

      setHeard(clean);
      setShowConfirm(true);
    };

    try {
      recognition.start();
    } catch {
      stopListening();
      setError(copy("voice.generic"));
    }
  }

  async function handleConfirm(verifiedText: string) {
    setBusy(true);
    setError(null);

    try {
      await onSave(verifiedText);
      setShowConfirm(false);
      setHeard("");
      setInterim("");
    } catch {
      setError(copy("save.failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm" aria-live="polite">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{copy("voice.title")}</p>
        <p className="text-lg font-bold text-slate-950">{copy("voice.subtitle")}</p>
        <p className="text-base leading-7 text-slate-700">{copy("voice.helper")}</p>
      </div>

      <div className="mt-5 space-y-4">
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border border-blue-800 bg-blue-700 px-5 py-4 text-lg font-semibold text-white active:bg-blue-900 disabled:opacity-60"
          aria-label={listening ? copy("voice.stop") : copy("voice.start")}
          disabled={busy}
        >
          {listening ? copy("voice.stop") : copy("voice.start")}
        </button>

        {listening && (
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
            <p className="text-lg font-semibold text-slate-950">{copy("voice.listening")}</p>
            <p className="mt-2 min-h-[3.5rem] text-xl font-medium text-slate-900">
              {interim || heard || copy("voice.waiting")}
            </p>
          </div>
        )}

        {!listening && heard && !showConfirm && (
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
            <p className="text-lg font-semibold text-slate-950">{copy("confirm.preview")}</p>
            <p className="mt-2 text-xl font-medium text-slate-900">{previewLine(heard)}</p>
            <button
              type="button"
              className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border border-slate-400 bg-white px-5 py-4 text-lg font-semibold text-slate-950 active:bg-slate-100"
              onClick={() => setShowConfirm(true)}
            >
              {copy("confirm.open")}
            </button>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-amber-700 bg-amber-50 px-4 py-3 text-base font-medium text-slate-950" role="alert">
            {error}
          </p>
        )}
      </div>

      <ConfirmationScreen
        open={showConfirm}
        heardText={heard}
        previewText={previewLine(heard)}
        busy={busy}
        locale={locale}
        onConfirm={handleConfirm}
        onCancel={() => {
          setShowConfirm(false);
          stopListening();
        }}
      />
    </section>
  );
}