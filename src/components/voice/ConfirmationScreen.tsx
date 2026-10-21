// Manual Text Confirmation 
import { useEffect, useRef, useState } from "react";
import { t } from "../../locales/dictionary";
import type { Locale } from "../../locales/dictionary";

export interface ConfirmationScreenProps {
  open: boolean;
  heardText: string;
  previewText: string;
  busy: boolean;
  locale: Locale;
  onConfirm: (verifiedText: string) => Promise<void> | void;
  onCancel: () => void;
}

export default function ConfirmationScreen({
  open,
  heardText,
  previewText,
  busy,
  locale,
  onConfirm,
  onCancel,
}: ConfirmationScreenProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [draft, setDraft] = useState(heardText);

  const copy = (key: Parameters<typeof t>[1]) => t(locale, key);

  useEffect(() => {
    if (open) {
      setDraft(heardText);
      window.setTimeout(() => closeRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, heardText]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center" role="presentation" onClick={onCancel}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{copy("confirm.eyebrow")}</p>
          <h2 id="confirm-title" className="text-2xl font-bold text-slate-950">
            {copy("confirm.title")}
          </h2>
          <p id="confirm-description" className="text-base leading-7 text-slate-700">
            {copy("confirm.body")}
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-600">{copy("confirm.preview")}</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{previewText || "—"}</p>
        </div>

        <label htmlFor="verified-text" className="mt-5 block text-lg font-semibold text-slate-950">
          {copy("confirm.editLabel")}
        </label>
        <textarea
          id="verified-text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="mt-2 min-h-[56px] w-full rounded-xl border border-slate-400 px-4 py-4 text-lg text-slate-950"
          placeholder={copy("confirm.placeholder")}
        />

        {!draft.trim() && (
          <p className="mt-3 rounded-xl border border-amber-700 bg-amber-50 px-4 py-3 text-base font-medium text-slate-950" role="alert">
            {copy("confirm.required")}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={closeRef}
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border border-slate-400 bg-white px-5 py-4 text-lg font-semibold text-slate-950 active:bg-slate-100"
            disabled={busy}
          >
            {copy("confirm.cancel")}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(draft.trim())}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border border-blue-800 bg-blue-700 px-5 py-4 text-lg font-semibold text-white active:bg-blue-900 disabled:opacity-60"
            disabled={busy || !draft.trim()}
          >
            {busy ? copy("confirm.saving") : copy("confirm.save")}
          </button>
        </div>
      </section>
    </div>
  );
}