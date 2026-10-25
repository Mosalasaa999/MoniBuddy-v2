import React, { useEffect, useRef } from 'react';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  maxWidthClass?: string;
  children: React.ReactNode;
  preventClose?: boolean;
  zIndexClass?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  labelledBy,
  maxWidthClass = 'max-w-md',
  children,
  preventClose = false,
  zIndexClass = 'z-50'
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      const container = dialogRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const container = dialogRef.current;
        if (!container) return;
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-slate-900/70 p-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !preventClose) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none`}
      >
        {children}
      </div>
    </div>
  );
};
