import { GoalPot, Transaction } from './types';

export interface PlainLedgerPayload {
  startingBalance: number;
  emergencyBuffer: number;
  burnRate: number;
  pots: GoalPot[];
  transactions: Transaction[];
  updatedAt: string;
}

export interface EncryptedLedgerEnvelope {
  v: 3;
  alg: 'AES-256-GCM';
  iv: string;
  ciphertext: string;
}

export interface PinLockoutRecord {
  failedAttempts: number;
  lockedUntilMs: number;
}

const PBKDF2_ITERATIONS = 100_000;
const LOCKOUT_STORAGE_KEY = 'monibuddy_pin_lockout_v1';
const MAX_PIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000;

/**
 * Exact integer-cent money helpers to prevent IEEE-754 floating-point drift
 * (e.g. 0.1 + 0.2 = 0.30000000000000004).
 */
export const toCents = (rands: number): number => {
  if (!Number.isFinite(rands)) return 0;
  return Math.round(rands * 100);
};

export const fromCents = (cents: number): number => {
  if (!Number.isFinite(cents)) return 0;
  return Math.round(cents) / 100;
};

export const roundMoney = (rands: number): number => fromCents(toCents(rands));

export const addMoney = (a: number, b: number): number =>
  fromCents(toCents(a) + toCents(b));

export const subMoney = (a: number, b: number): number =>
  fromCents(toCents(a) - toCents(b));

export const sumMoney = (values: readonly number[]): number =>
  fromCents(values.reduce((acc, v) => acc + toCents(v), 0));

/**
 * Formats and parses local calendar dates ('YYYY-MM-DD') without UTC midnight shift
 * so SAST (UTC+2) entries between 00:00 and 01:59 stay on the correct local day.
 */
export const getLocalIsoDate = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseLocalIsoDateMs = (isoDate: string): number => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    const fallback = Date.parse(isoDate);
    return Number.isFinite(fallback) ? fallback : Date.now();
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  return new Date(year, month, day, 12, 0, 0, 0).getTime();
};

export const hasWebCryptoSubtle = (): boolean =>
  typeof globalThis !== 'undefined' &&
  typeof globalThis.crypto !== 'undefined' &&
  typeof globalThis.crypto.subtle !== 'undefined';

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

const hexToBytes = (hex: string): Uint8Array<ArrayBuffer> => {
  const clean = hex.trim();
  const out = new Uint8Array(new ArrayBuffer(Math.floor(clean.length / 2)));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
  }
  return out;
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  if (typeof btoa === 'function') {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
};

const base64ToBytes = (b64: string): Uint8Array<ArrayBuffer> => {
  if (typeof atob === 'function') {
    const binary = atob(b64);
    const out = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  }
  const nodeBuf = Buffer.from(b64, 'base64');
  const out = new Uint8Array(new ArrayBuffer(nodeBuf.length));
  out.set(nodeBuf);
  return out;
};

export const generateRandomSaltHex = (byteLength = 16): string => {
  const buf = new Uint8Array(byteLength);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < byteLength; i++) {
      buf[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytesToHex(buf);
};

const importPinBaseKey = async (pin: string): Promise<CryptoKey> => {
  const raw = new TextEncoder().encode(`monibuddy_v3_pin:${pin.trim()}`);
  return globalThis.crypto.subtle.importKey('raw', raw, 'PBKDF2', false, [
    'deriveBits',
    'deriveKey'
  ]);
};

/**
 * Derives a 256-bit PBKDF2-HMAC-SHA256 PIN verifier (100,000 iterations + random 128-bit salt).
 */
export const derivePbkdf2PinHash = async (
  pin: string,
  saltHex: string
): Promise<string> => {
  const baseKey = await importPinBaseKey(pin);
  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    baseKey,
    256
  );
  return bytesToHex(new Uint8Array(bits));
};

/**
 * Derives a non-extractable 256-bit AES-GCM key from the user's PIN + separate ledger salt.
 */
export const deriveLedgerAesKey = async (
  pin: string,
  ledgerSaltHex: string
): Promise<CryptoKey> => {
  const baseKey = await importPinBaseKey(pin);
  return globalThis.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: hexToBytes(ledgerSaltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptLedgerPayload = async (
  payload: PlainLedgerPayload,
  key: CryptoKey
): Promise<EncryptedLedgerEnvelope> => {
  const iv = new Uint8Array(new ArrayBuffer(12));
  globalThis.crypto.getRandomValues(iv);
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  return {
    v: 3,
    alg: 'AES-256-GCM',
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encryptedBuffer))
  };
};

export const isEncryptedLedgerEnvelope = (
  value: unknown
): value is EncryptedLedgerEnvelope => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.v === 3 &&
    candidate.alg === 'AES-256-GCM' &&
    typeof candidate.iv === 'string' &&
    typeof candidate.ciphertext === 'string'
  );
};

export const decryptLedgerEnvelope = async (
  envelope: EncryptedLedgerEnvelope,
  key: CryptoKey
): Promise<PlainLedgerPayload> => {
  const iv = base64ToBytes(envelope.iv);
  const ciphertext = base64ToBytes(envelope.ciphertext);
  const decrypted = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  const json = new TextDecoder().decode(decrypted);
  return JSON.parse(json) as PlainLedgerPayload;
};

/**
 * Constant-time string comparison to avoid timing side-channels on PIN hash checks.
 */
export const timingSafeEqualHex = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
};

/**
 * Persistent PIN brute-force rate limiter & 60-second lockout per identifier.
 */
const readLockoutMap = (): Record<string, PinLockoutRecord> => {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeLockoutMap = (map: Record<string, PinLockoutRecord>) => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
};

export const getPinLockoutRemainingSeconds = (
  identifierKey: string,
  nowMs: number = Date.now()
): number => {
  const map = readLockoutMap();
  const record = map[identifierKey];
  if (!record || record.lockedUntilMs <= nowMs) return 0;
  return Math.ceil((record.lockedUntilMs - nowMs) / 1000);
};

export const recordFailedPinAttempt = (
  identifierKey: string,
  nowMs: number = Date.now()
): { locked: boolean; remainingSeconds: number; attemptsLeft: number } => {
  const map = readLockoutMap();
  const prev = map[identifierKey] ?? { failedAttempts: 0, lockedUntilMs: 0 };
  const baseAttempts = prev.lockedUntilMs > 0 && prev.lockedUntilMs <= nowMs ? 0 : prev.failedAttempts;
  const nextAttempts = baseAttempts + 1;

  if (nextAttempts >= MAX_PIN_ATTEMPTS) {
    const lockedUntilMs = nowMs + LOCKOUT_DURATION_MS;
    map[identifierKey] = { failedAttempts: nextAttempts, lockedUntilMs };
    writeLockoutMap(map);
    return {
      locked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0
    };
  }

  map[identifierKey] = { failedAttempts: nextAttempts, lockedUntilMs: 0 };
  writeLockoutMap(map);
  return {
    locked: false,
    remainingSeconds: 0,
    attemptsLeft: Math.max(0, MAX_PIN_ATTEMPTS - nextAttempts)
  };
};

export const clearPinLockout = (identifierKey: string) => {
  const map = readLockoutMap();
  if (map[identifierKey]) {
    delete map[identifierKey];
    writeLockoutMap(map);
  }
};
