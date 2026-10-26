/**
 * @fileoverview Hardened Offline-First Rule-Based Local Scam Parser for MoniBuddy ("Context-Aware Defensive Shield").
 *
 * Implements:
 * 1. Anti-Evasion Normalization Pipeline (`normalizeObfuscatedText`):
 *    - Strips zero-width / invisible Unicode characters (`\u200B-\u200F`, `\uFEFF`, `\u00AD`).
 *    - Collapses intra-word punctuation/delimiter splitting (`f-e-e`, `O.T.P`, `p_i_n` -> `fee`, `otp`, `pin`).
 *    - Maps adversarial leetspeak inside alphabetic tokens (`@`->`a`, `0`->`o`, `1`->`i`, `3`->`e`, `$`->`s`, `5`->`s`, `7`->`t`).
 *    - Expands regional vernacular slang via `expandVernacularAliasesForSecurity` (`SlangDictionary.ts`).
 *    - Enforces a safe bounded inspection cap (`MAX_INSPECTION_CHARS = 12_000`) to guarantee `< 25ms` execution and zero ReDoS.
 * 2. False-Positive Suppression & Benign Context Allowlists:
 *    - Compound proximity conditions (never flags isolated words like "loan", "fee", "OTP", or "SASSA").
 *    - Defensive bank/grant warning allowlist (e.g. "Never share your OTP or PIN with anyone" does NOT trigger PIN disclosure).
 *    - Official agent tariff cross-check (mentioning "agent fee" when `agentFeeChargedZar <= officialMaxFeeZar` is suppressed).
 * 3. Tiered Confidence & Shadow-Mode Architecture:
 *    - `[0.00 - 0.29]` -> `NONE` (Safe pass)
 *    - `[0.30 - 0.69]` -> `PASSIVE_MICROCOPY` (Subtle non-blocking UI guidance)
 *    - `[0.70 - 1.00]` -> `VOICE_CONFIRMATION_MODAL` (High-risk spoken + modal confirmation gate)
 *    - Supports `shadowMode` rules (passive log-only telemetry without raising user friction unless promoted).
 */

import { expandVernacularAliasesForSecurity } from './SlangDictionary';

export type ThreatCategory =
  | 'PREDATORY_LENDING_UPFRONT_FEE'
  | 'PREDATORY_LENDING_UNREALISTIC_RETURN'
  | 'SOCIAL_ENGINEERING_URGENCY'
  | 'OFFICIAL_IMPERSONATION'
  | 'AGENT_FEE_EXTORTION'
  | 'PIN_OTP_DISCLOSURE'
  | 'TELEMETRY_ANOMALY'
  | 'EVASION_OBFUSCATION';

export type ScamSeverity = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FrictionTier =
  | 'NONE'
  | 'PASSIVE_MICROCOPY'
  | 'VOICE_CONFIRMATION_MODAL';

export type TransactionOperationType =
  | 'p2p_transfer'
  | 'loan_fee_payment'
  | 'cash_out'
  | 'cash_in'
  | 'merchant_payment';

export interface TransactionTelemetryPayload {
  readonly transactionId?: string;
  readonly recipientId: string;
  readonly recipientName?: string;
  readonly amountZar: number;
  /** Age of the recipient account in days (0 = newly created / unverified burner). */
  readonly recipientAccountAgeDays: number;
  /** Whether the recipient was newly added to the user's contact/beneficiary book in the last 24h. */
  readonly isNewlyAddedRecipient: boolean;
  /** Number of outbound transfers initiated by the user in the last 60 minutes. */
  readonly recentTransferCountLastHour: number;
  /** Optional operation type for cash-in / cash-out fee validation. */
  readonly operationType?: TransactionOperationType;
  /** Optional fee demanded or charged by a cash-out/mobile-money agent in ZAR. */
  readonly agentFeeChargedZar?: number;
  /** Optional NCR (National Credit Regulator) registration status if known locally. */
  readonly isRegisteredCreditProvider?: boolean;
  readonly timestampIso?: string;
}

export interface ScamEvaluationOptions {
  /** When true, experimental shadow rules are promoted from log-only to active score enforcement. */
  readonly promoteShadowRules?: boolean;
}

export interface HeuristicRuleDefinition {
  readonly id: string;
  readonly category: ThreatCategory;
  readonly weight: number;
  readonly description: string;
  readonly patterns: readonly RegExp[];
  /** Optional flag marking newly staged rules that run in passive log-only Shadow Mode by default. */
  readonly shadowOnlyByDefault?: boolean;
}

export interface DetectedThreatSignal {
  readonly ruleId: string;
  readonly category: ThreatCategory;
  readonly weight: number;
  readonly description: string;
  readonly matchedKeywords: readonly string[];
}

export interface NormalizationResult {
  readonly sanitizedRawText: string;
  readonly deobfuscatedText: string;
  readonly obfuscationIndicators: readonly string[];
  readonly wasTruncated: boolean;
}

export interface AgentFeeTier {
  readonly minAmountZar: number;
  readonly maxAmountZar: number;
  readonly officialMaxFeeZar: number;
}

export interface ScamParserEvaluation {
  /** Normalized risk score strictly bounded in [0.0, 1.0]. */
  readonly riskScore: number;
  readonly severity: ScamSeverity;
  readonly frictionTier: FrictionTier;
  /** True when `riskScore >= 0.70` (triggers mandatory VoiceConfirmationModal). */
  readonly isBlockedRecommended: boolean;
  /** Subtle non-blocking UI hint surfaced when `0.30 <= riskScore < 0.70` (or tariff context applies). */
  readonly passiveMicroCopy: string | null;
  readonly signals: readonly DetectedThreatSignal[];
  /** Signals captured in passive Shadow Mode (logged for QA observation without adding user friction). */
  readonly shadowSignals: readonly DetectedThreatSignal[];
  /** Benign allowlist exclusions that suppressed potential false positives. */
  readonly suppressedAllowlistNotes: readonly string[];
  readonly matchedKeywords: readonly string[];
  readonly obfuscationIndicators: readonly string[];
  readonly categoryBreakdown: Readonly<Record<ThreatCategory, number>>;
  readonly feeTierViolation?: {
    readonly withdrawalAmountZar: number;
    readonly chargedFeeZar: number;
    readonly officialMaxFeeZar: number;
    readonly overchargeAmountZar: number;
  };
  readonly executionTimeMs: number;
  readonly evaluatedAtIso: string;
}

/** Maximum characters evaluated per check to prevent CPU freezes on huge pasted payloads. */
export const MAX_INSPECTION_CHARS = 12_000;

/**
 * Official South African township mobile-money / voucher cash-out fee schedule (ZAR).
 */
export const OFFICIAL_CASH_OUT_FEE_TIERS: readonly AgentFeeTier[] = [
  { minAmountZar: 1, maxAmountZar: 100, officialMaxFeeZar: 6 },
  { minAmountZar: 100.01, maxAmountZar: 500, officialMaxFeeZar: 10 },
  { minAmountZar: 500.01, maxAmountZar: 1000, officialMaxFeeZar: 15 },
  { minAmountZar: 1000.01, maxAmountZar: 3000, officialMaxFeeZar: 25 },
  { minAmountZar: 3000.01, maxAmountZar: 5000, officialMaxFeeZar: 35 }
];

const LEETSPEAK_CHAR_MAP: Readonly<Record<string, string>> = {
  '@': 'a',
  '4': 'a',
  '0': 'o',
  '1': 'i',
  '!': 'i',
  '3': 'e',
  '$': 's',
  '5': 's',
  '7': 't'
};

/**
 * Pre-processing text sanitizer that neutralizes adversarial evasion tactics
 * (zero-width characters, character-by-character punctuation splitting, leetspeak, and township slang)
 * while preserving numeric currency tokens in a dual stream.
 */
export const normalizeObfuscatedText = (rawInput: unknown): NormalizationResult => {
  if (typeof rawInput !== 'string' || rawInput.length === 0) {
    return {
      sanitizedRawText: '',
      deobfuscatedText: '',
      obfuscationIndicators: [],
      wasTruncated: false
    };
  }

  const wasTruncated = rawInput.length > MAX_INSPECTION_CHARS;
  const bounded = wasTruncated ? rawInput.slice(0, MAX_INSPECTION_CHARS) : rawInput;
  const indicators: string[] = [];

  // 1. Strip zero-width spaces, joiners, soft hyphens, and directional overrides
  const zeroWidthRegex = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u00AD]/gu;
  if (zeroWidthRegex.test(bounded)) {
    indicators.push('zero_width_unicode_injection');
  }
  const withoutZeroWidth = bounded
    .replace(zeroWidthRegex, '')
    .normalize('NFKC');

  const sanitizedRawText = withoutZeroWidth.replace(/\s+/g, ' ').trim();

  // 2. Collapse deliberate intra-word punctuation splitting (e.g. "f-e-e", "O.T.P", "p_a_y", "s a s s a" with dots/hyphens)
  let collapsed = sanitizedRawText;
  const splitTokenPattern = /\b([a-zA-Z0-9@$!])(?:[.\-_/*+~|]([a-zA-Z0-9@$!])){2,}\b/gu;
  if (splitTokenPattern.test(collapsed)) {
    indicators.push('delimited_char_splitting');
    collapsed = collapsed.replace(splitTokenPattern, match =>
      match.replace(/[.\-_/*+~|]/g, '')
    );
  }

  // Also collapse spaced single-letter critical tokens like "f e e", "o t p", "p i n", "s a s s a"
  const spacedAcronymPattern =
    /\b(?:o\s+t\s+p|p\s+i\s+n|f\s+e\s+e|s\s+a\s+s\s+s\s+a|l\s+o\s+a\s+n)\b/giu;
  if (spacedAcronymPattern.test(collapsed)) {
    indicators.push('spaced_letter_obfuscation');
    collapsed = collapsed.replace(spacedAcronymPattern, match =>
      match.replace(/\s+/g, '')
    );
  }

  // 3. Convert leetspeak ONLY inside mixed letter+symbol/digit words (never corrupt pure amounts like R450 or 100%)
  let leetConvertedCount = 0;
  const leetDecoded = collapsed.replace(/\b[\p{L}\d@$!]{3,24}\b/gu, token => {
    // Keep pure numbers, currency tokens ("R150", "R1000"), or ordinals ("24hrs", "1st") untouched
    if (/^\d+$/.test(token)) return token;
    if (/^[rR]\d+(?:[.,]\d+)?$/.test(token)) return token;
    if (/^\d+(?:hrs|hr|mins|min|am|pm|st|nd|rd|th|k)$/i.test(token)) return token;
    if (/^1voucher$/i.test(token)) return token;

    const hasLetter = /\p{L}/u.test(token);
    const hasLeetSymbol = /[@$!013457]/.test(token);
    if (!hasLetter && !/^0[tT][pP]$/.test(token)) {
      return token;
    }
    if (!hasLeetSymbol) {
      return token;
    }

    leetConvertedCount += 1;
    return Array.from(token)
      .map(ch => LEETSPEAK_CHAR_MAP[ch] ?? ch)
      .join('');
  });

  if (leetConvertedCount > 0) {
    indicators.push('leetspeak_homoglyph_substitution');
  }

  // 4. Expand township vernacular slang aliases ("tjotjo" -> "upfront release fee", "2 clipa" -> "R100")
  const deobfuscatedText = expandVernacularAliasesForSecurity(leetDecoded)
    .replace(/\s+/g, ' ')
    .trim();

  return {
    sanitizedRawText,
    deobfuscatedText,
    obfuscationIndicators: indicators,
    wasTruncated
  };
};

/**
 * Defensive allowlist patterns that identify legitimate educational/security footers
 * from South African banks and SASSA (e.g., "Capitec will NEVER ask for your PIN or OTP").
 */
const DEFENSIVE_OTP_WARNING_PATTERNS: readonly RegExp[] = [
  /\b(never|do\s+not|don'?t|ungaze|o\s+se\s+ke)\b[^.!?]{0,45}\b(share|give|disclose|send|reply\s+with|tell)\b[^.!?]{0,45}\b(otp|one[\s-]time\s+pin|pin|password|cvv)\b/giu,
  /\b(bank|capitec|fnb|absa|standard\s+bank|nedbank|tymebank|sassa)\s+will\s+never\s+ask\s+for\s+your\s+(pin|otp|password)\b/giu
];

/**
 * Allowlist patterns for benign official informational notices (deposit confirmations, scheduled grant payouts)
 * that lack any payment demand, link phishing, or OTP solicitation.
 */
const BENIGN_OFFICIAL_NOTICE_PATTERNS: readonly RegExp[] = [
  /\bsassa\b[^.!?]{0,60}\b(grant\s+payment\s+date|paid\s+into\s+your\s+account|available\s+at\s+retail\s+stores|collect\s+at\s+shoprite|collect\s+at\s+boxer)\b/giu,
  /\b(cash\s+deposit\s+received|card\s+purchase\s+at|salary\s+credited|available\s+balance\s+r?\s*\d+)\b/giu
];

/**
 * Hardcoded compound heuristic threat dictionary.
 * Every rule requires compound contextual tokens within bounded character windows (`{0,45}`)
 * to prevent both isolated-word false positives and catastrophic regex backtracking.
 */
export const HEURISTIC_THREAT_DICTIONARY: readonly HeuristicRuleDefinition[] = [
  // 1. Predatory Lending — Upfront / Advance Fee Disbursement Traps
  {
    id: 'RULE_PREDATORY_UPFRONT_FEE',
    category: 'PREDATORY_LENDING_UPFRONT_FEE',
    weight: 0.55,
    description: 'Demands an upfront processing, admin, legal, or release fee before disbursing a loan.',
    patterns: [
      /\b(pay|send|deposit|transfer)\b[^.!?]{0,45}\b(processing|admin|administrative|initiation|release|clearance|registration|verification|insurance|lawyer|upfront)\s+(fee|deposit|charge|cost|money)\b/giu,
      /\b(processing|admin|release|registration|clearance|activation|upfront)\s+(fee|deposit)\s+(first|before|advance|to\s+release|to\s+disburse|to\s+unlock|required)\b/giu,
      /\b(fee|deposit)\b[^.!?]{0,30}\b(before|in\s+advance|prior\s+to)\b[^.!?]{0,30}\b(loan|disburse|disbursement|payout|release)\b/giu,
      /\bdeposit\s+r?\s*\d+[^.!?]{0,35}\b(to\s+release|to\s+unlock|for\s+loan|get\s+r?\s*\d+)\b/giu,
      /\b(moneymarket|pep\s*cell|kazang|flash\s*voucher|1voucher|ott\s*voucher)\b[^.!?]{0,50}\b(release|loan|approved|fee)\b/giu,
      /\bkhokha\b[^.!?]{0,35}\b(imali\s+yokuvula|ifizi|ukukhulula\s+imalimboleko)\b/giu,
      /\blefa\b[^.!?]{0,35}\b(tefo\s+ya\s+go\s+bula|kadimo)\b/giu,
      /\b(pay|send|deposit)\b[^.!?]{0,45}\b(uniform|medical|background\s+check|training|job\s+placement|interview)\s+(fee|deposit|money)\b/giu,
      /\b(job|learnership|internship)\s+(guaranteed|confirmed|approved)[^.!?]{0,45}\b(pay|deposit|ewallet|1voucher)\b/giu
    ]
  },
  // 2. Predatory Lending — Unrealistic Returns, Mashonisa Compounding & Blacklist-Free Hooks
  {
    id: 'RULE_PREDATORY_UNREALISTIC_TERMS',
    category: 'PREDATORY_LENDING_UNREALISTIC_RETURN',
    weight: 0.45,
    description: 'Promises guaranteed instant loans without credit checks, compounding daily mashonisa interest, pyramid stokvel multipliers, or SASSA card confiscation.',
    patterns: [
      /\b(100%|200%|300%|double\s+your\s+money)\s*(daily|weekly|in\s+24\s*hours|return|profit)\b/giu,
      /\bguaranteed\s+instant\s+(loan|payout|cash|approval)\b/giu,
      /\b(no\s+credit\s+check|blacklisted\s+welcome|without\s+payslip)\b[^.!?]{0,45}\b(instant|approved|loan|cash)\b/giu,
      /\b(\d{2,3}%\s*(daily|per\s+day|interest\s+per\s+week)|compounding\s+daily\s+interest|mashonisa\s+special)\b/giu,
      /\b(leave|hand\s+over|surrender|keep)\s+(your\s+)?(sassa\s+card|id\s+book|bank\s+card)\b/giu,
      /\b(whatsapp\s+stokvel|gifting\s+circle|blessing\s+circle|blesser\s+table)\b[^.!?]{0,65}\b(join|put|invest|multiply|double|payout|get\s+r?\s*\d+)/giu,
      /\bguaranteed\s+double\s+your\s+money\b/giu
    ]
  },
  // 3. Social Engineering & High-Pressure Temporal Urgency Cues
  {
    id: 'RULE_SOCIAL_URGENCY_PRESSURE',
    category: 'SOCIAL_ENGINEERING_URGENCY',
    weight: 0.36,
    description: 'Applies high-pressure urgency, panic emergencies (police/hospital), or imminent account lock threats.',
    patterns: [
      /\b(send\s+right\s+now|transfer\s+right\s+now|send\s+immediately|reply\s+immediately|within\s+\d+\s*(minutes|mins|hours|hrs)|before\s+midnight|urgent\s+notice|act\s+fast)\b/giu,
      /\b(arrested|in\s+custody|bail\s+money|roadblock\s+fine|locked\s+up\s+at\s+police|detained\s+at\s+police)\b[^.!?]{0,45}\b(send|pay|transfer|ewallet|cash|money|urgently|now|r\s*\d+)\b/giu,
      /\b(hospital\s+emergency|casualty|icu|ambulance|accident\s+ward|urgent\s+operation)\b/giu,
      /\b(account\s+(locked|suspended|blocked|frozen)|grant\s+(suspended|on\s+hold|forfeited)|sim\s+swap\s+pending)\b/giu,
      /\b(sent\s+by\s+mistake|wrong\s+number\s+please\s+reverse|send\s+it\s+back)\b/giu,
      /\b(phuthuma\s+uthumele|thumela\s+imali\s+manje|esibhedlela\s+phuthuma)\b/giu,
      /\b(romele\s+gonabjale|sepetlele\s+ka\s+tshoganetso)\b/giu
    ]
  },
  // 4. Impersonation of Official Entities (SASSA, Bank Fraud Dept, SARS, SAPO/Courier, Network Operator)
  {
    id: 'RULE_OFFICIAL_IMPERSONATION',
    category: 'OFFICIAL_IMPERSONATION',
    weight: 0.42,
    description: 'Claims authority as a SASSA/SASA official, bank fraud investigator, SARS agent, courier/SAPO customs desk, or unofficial phishing portal.',
    patterns: [
      /\b(sassa|sasa)\s+(official|agent|grant\s+officer|verification\s+desk|srd\s+department|urgent\s+notice)\b/giu,
      /\b(bank|capitec|fnb|standard\s+bank|absa|nedbank|tymebank)\s+(fraud\s+department|security\s+team|forensics|investigator|cancellation\s+desk)\b[^.!?]{0,60}\b(reply|otp|pin|reverse|cancel|transfer|move\s+funds|safe\s+account)\b/giu,
      /\b(network\s+operator|vodacom|mtn|telkom|cell\s*c)\s+(agent|sim\s+department|rica\s+officer|upgrade\s+desk)\b[^.!?]{0,50}\b(otp|pin|code|block|suspend)\b/giu,
      /\b(sars\s+(official|erefund|tax\s+refund\s+portal)|home\s+affairs\s+officer)\b/giu,
      /\b(sapo|post\s+office|dhl|ram\s+courier|customs\s+clearance)\b[^.!?]{0,50}\b(parcel\s+held|customs\s+fee|release\s+fee|pay\s+r?\s*\d+)\b/giu,
      /\b(http:\/\/|bit\.ly\/|tinyurl\.com\/|[a-z0-9-]+-(?:portal|verify|sassa|erefund)\.[a-z]{2,})/giu
    ]
  },
  // 5. Agent Extortion & Cash-Out Surcharge / PIN & OTP Disclosure
  {
    id: 'RULE_PIN_OTP_DISCLOSURE',
    category: 'PIN_OTP_DISCLOSURE',
    weight: 0.60,
    description: 'Requests secret bank PIN, One-Time PIN (OTP), USSD auth code, or voucher secret during a transaction or cash-out.',
    patterns: [
      /\b(share|send|reply\s+with|read\s+out|give\s+me|enter\s+your|tell\s+the\s+agent|forward\s+the)\b[^.!?]{0,40}\b(otp|one[\s-]time\s+pin|secret\s+pin|5[\s-]digit\s+pin|4[\s-]digit\s+pin|bank\s+pin|cvv|ussd\s+code|cash[\s-]send\s+pin)\b/giu,
      /\b(otp|secret\s+pin|one[\s-]time\s+pin)\s+(to\s+cancel|to\s+reverse|to\s+verify|to\s+release|for\s+cash[\s-]out)\b/giu,
      /\b(ungiphe\s+i[\s-]?pin|ipini\s+yakho|ikhodi\s+ye[\s-]?otp)\b/giu,
      /\b(mpha\s+pin\s+ya\s+gago|nomoro\s+ya\s+sephiri)\b/giu
    ]
  },
  {
    id: 'RULE_AGENT_FEE_EXTORTION_TEXT',
    category: 'AGENT_FEE_EXTORTION',
    weight: 0.46,
    description: 'Demands unauthorized extra agent cash-out commission, "system offline" surcharge, or split-withdrawal fee.',
    patterns: [
      /\b(agent|spaza|kiosk|teller)\b[^.!?]{0,45}\b(extra\s+fee|extra\s+cash[\s-]out\s+fee|system\s+offline\s+fee|after[\s-]hours\s+fee|unofficial\s+commission)\b/giu,
      /\b(pay|give)\s+r?\s*\d+\s+(extra|cash)\s+(for\s+cash[\s-]out|to\s+withdraw|agent\s+cut)\b/giu
    ]
  },
  // 6. Experimental Shadow-Mode Rule (passive log-only by default unless promoted)
  {
    id: 'SHADOW_CRYPTO_FOREX_WHATSAPP_GROUP',
    category: 'PREDATORY_LENDING_UNREALISTIC_RETURN',
    weight: 0.38,
    description: '[Shadow Rule] Unsolicited WhatsApp forex/crypto signal mentorship recruitment.',
    shadowOnlyByDefault: true,
    patterns: [
      /\b(whatsapp\s+forex|crypto\s+mentor|luno\s+mining\s+pool|automated\s+forex\s+bot)\b/giu
    ]
  }
];

/**
 * Sanitizes incoming telemetry fields so `NaN`, `Infinity`, negative values, or non-finite inputs
 * never throw or corrupt risk math.
 */
export const sanitizeTelemetry = (
  telemetry?: TransactionTelemetryPayload
): TransactionTelemetryPayload | undefined => {
  if (!telemetry || typeof telemetry !== 'object') return undefined;

  const safeNumber = (val: unknown, fallback: number, maxCap = 10_000_000): number => {
    if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
    return Math.min(maxCap, Math.max(0, val));
  };

  const validOps: readonly TransactionOperationType[] = [
    'p2p_transfer',
    'loan_fee_payment',
    'cash_out',
    'cash_in',
    'merchant_payment'
  ];

  const safeOp =
    telemetry.operationType && validOps.includes(telemetry.operationType)
      ? telemetry.operationType
      : 'p2p_transfer';

  return {
    transactionId:
      typeof telemetry.transactionId === 'string' && telemetry.transactionId.trim()
        ? telemetry.transactionId.trim().slice(0, 64)
        : undefined,
    recipientId:
      typeof telemetry.recipientId === 'string' && telemetry.recipientId.trim()
        ? telemetry.recipientId.trim().slice(0, 64)
        : 'UNSPECIFIED',
    recipientName:
      typeof telemetry.recipientName === 'string' && telemetry.recipientName.trim()
        ? telemetry.recipientName.trim().slice(0, 80)
        : undefined,
    amountZar: safeNumber(telemetry.amountZar, 0),
    recipientAccountAgeDays:
      typeof telemetry.recipientAccountAgeDays === 'number' &&
      Number.isFinite(telemetry.recipientAccountAgeDays) &&
      telemetry.recipientAccountAgeDays >= 0
        ? Math.min(36_500, Math.floor(telemetry.recipientAccountAgeDays))
        : 365, // Unknown/invalid negative age defaults safely to established rather than false-flagging
    isNewlyAddedRecipient: Boolean(telemetry.isNewlyAddedRecipient),
    recentTransferCountLastHour: safeNumber(telemetry.recentTransferCountLastHour, 0, 1_000),
    operationType: safeOp,
    agentFeeChargedZar:
      typeof telemetry.agentFeeChargedZar === 'number' &&
      Number.isFinite(telemetry.agentFeeChargedZar) &&
      telemetry.agentFeeChargedZar >= 0
        ? Math.min(1_000_000, telemetry.agentFeeChargedZar)
        : undefined,
    isRegisteredCreditProvider:
      typeof telemetry.isRegisteredCreditProvider === 'boolean'
        ? telemetry.isRegisteredCreditProvider
        : undefined,
    timestampIso:
      typeof telemetry.timestampIso === 'string' && telemetry.timestampIso.trim()
        ? telemetry.timestampIso
        : undefined
  };
};

/**
 * Looks up the maximum permitted mobile-money / voucher cash-out fee for a given ZAR withdrawal.
 */
export const getOfficialMaxAgentFeeZar = (withdrawalAmountZar: number): number => {
  if (typeof withdrawalAmountZar !== 'number' || !Number.isFinite(withdrawalAmountZar) || withdrawalAmountZar <= 0) {
    return 0;
  }
  const matchedTier = OFFICIAL_CASH_OUT_FEE_TIERS.find(
    tier => withdrawalAmountZar >= tier.minAmountZar && withdrawalAmountZar <= tier.maxAmountZar
  );
  if (matchedTier) {
    return matchedTier.officialMaxFeeZar;
  }
  return Math.round(withdrawalAmountZar * 0.008);
};

const clampScore = (raw: number): number => {
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  if (raw >= 1) return 1;
  return Number(raw.toFixed(3));
};

const scoreToSeverity = (score: number): ScamSeverity => {
  if (score >= 0.80) return 'CRITICAL';
  if (score >= 0.70) return 'HIGH';
  if (score >= 0.30) return 'MEDIUM';
  if (score >= 0.12) return 'LOW';
  return 'SAFE';
};

const scoreToFrictionTier = (score: number): FrictionTier => {
  if (score >= 0.70) return 'VOICE_CONFIRMATION_MODAL';
  if (score >= 0.30) return 'PASSIVE_MICROCOPY';
  return 'NONE';
};

const stripDefensiveClauses = (
  text: string
): { cleaned: string; allowlistNotes: string[] } => {
  let cleaned = text;
  const allowlistNotes: string[] = [];

  for (const pattern of DEFENSIVE_OTP_WARNING_PATTERNS) {
    const clone = new RegExp(pattern.source, pattern.flags);
    if (clone.test(cleaned)) {
      allowlistNotes.push(
        'Suppressed defensive bank/grant security reminder ("Never share your OTP/PIN").'
      );
      cleaned = cleaned.replace(new RegExp(pattern.source, pattern.flags), ' ');
    }
  }

  for (const benignPattern of BENIGN_OFFICIAL_NOTICE_PATTERNS) {
    const clone = new RegExp(benignPattern.source, benignPattern.flags);
    if (clone.test(cleaned)) {
      allowlistNotes.push('Matched standard informational deposit/grant notice pattern.');
    }
  }

  return { cleaned: cleaned.replace(/\s+/g, ' ').trim(), allowlistNotes };
};

/**
 * Evaluates a user transcript (voice or SMS/WhatsApp text) and optional transaction telemetry
 * completely offline against deterministic compound threat rules, anti-evasion normalization,
 * and false-positive allowlists.
 */
export const evaluateScamRisk = (
  transcriptOrMessage: string,
  rawTelemetry?: TransactionTelemetryPayload,
  options?: ScamEvaluationOptions
): ScamParserEvaluation => {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const safeInput = typeof transcriptOrMessage === 'string' ? transcriptOrMessage : '';
  const telemetry = sanitizeTelemetry(rawTelemetry);
  const normalization = normalizeObfuscatedText(safeInput);

  const signals: DetectedThreatSignal[] = [];
  const shadowSignals: DetectedThreatSignal[] = [];
  const suppressedAllowlistNotes: string[] = [];
  const allMatchedKeywords = new Set<string>();

  const categoryBreakdown: Record<ThreatCategory, number> = {
    PREDATORY_LENDING_UPFRONT_FEE: 0,
    PREDATORY_LENDING_UNREALISTIC_RETURN: 0,
    SOCIAL_ENGINEERING_URGENCY: 0,
    OFFICIAL_IMPERSONATION: 0,
    AGENT_FEE_EXTORTION: 0,
    PIN_OTP_DISCLOSURE: 0,
    TELEMETRY_ANOMALY: 0,
    EVASION_OBFUSCATION: 0
  };

  // Strip defensive educational bank warnings ("Never share your OTP") BEFORE matching PIN disclosure rules
  const rawFiltered = stripDefensiveClauses(normalization.sanitizedRawText);
  const deobfuscatedFiltered = stripDefensiveClauses(normalization.deobfuscatedText);
  for (const note of rawFiltered.allowlistNotes) {
    if (!suppressedAllowlistNotes.includes(note)) {
      suppressedAllowlistNotes.push(note);
    }
  }

  // Check whether agent fee is explicitly within official published cash-out tariff
  const isCompliantAgentFeeContext =
    telemetry !== undefined &&
    (telemetry.operationType === 'cash_out' || telemetry.operationType === 'cash_in') &&
    typeof telemetry.agentFeeChargedZar === 'number' &&
    telemetry.amountZar > 0 &&
    telemetry.agentFeeChargedZar <= getOfficialMaxAgentFeeZar(telemetry.amountZar);

  if (
    isCompliantAgentFeeContext &&
    /\b(agent|cash[\s-]out|fee|tariff)\b/iu.test(deobfuscatedFiltered.cleaned)
  ) {
    suppressedAllowlistNotes.push(
      `Verified compliant cash-out tariff (R${telemetry.agentFeeChargedZar} <= R${getOfficialMaxAgentFeeZar(
        telemetry.amountZar
      )} official cap).`
    );
  }

  // 1. Evaluate compound heuristics across both sanitized raw and de-obfuscated streams
  const streamsToInspect = Array.from(
    new Set([rawFiltered.cleaned, deobfuscatedFiltered.cleaned].filter(Boolean))
  );

  if (streamsToInspect.length > 0) {
    for (const rule of HEURISTIC_THREAT_DICTIONARY) {
      // Allowlist exclusion: If agent fee is verified compliant in telemetry, do not fire text fee-extortion rule unless PIN is demanded
      if (rule.id === 'RULE_AGENT_FEE_EXTORTION_TEXT' && isCompliantAgentFeeContext) {
        continue;
      }

      const ruleMatches = new Set<string>();

      for (const candidateText of streamsToInspect) {
        for (const regex of rule.patterns) {
          const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
          const clone = new RegExp(regex.source, flags);
          for (const match of candidateText.matchAll(clone)) {
            const phrase = match[0].trim();
            if (phrase) {
              ruleMatches.add(phrase);
            }
          }
        }
      }

      if (ruleMatches.size > 0) {
        const reinforcement = Math.min(0.08, (ruleMatches.size - 1) * 0.04);
        const effectiveWeight = Number((rule.weight + reinforcement).toFixed(3));
        const signal: DetectedThreatSignal = {
          ruleId: rule.id,
          category: rule.category,
          weight: effectiveWeight,
          description: rule.description,
          matchedKeywords: [...ruleMatches]
        };

        if (rule.shadowOnlyByDefault && !options?.promoteShadowRules) {
          shadowSignals.push(signal);
        } else {
          signals.push(signal);
          for (const kw of ruleMatches) {
            allMatchedKeywords.add(kw);
          }
          categoryBreakdown[rule.category] = Number(
            (categoryBreakdown[rule.category] + effectiveWeight).toFixed(3)
          );
        }
      }
    }
  }

  // 1b. If adversarial obfuscation was used AND at least one substantive threat rule matched, add evasion boost
  const hasSubstantiveTextThreat = signals.length > 0;
  if (normalization.obfuscationIndicators.length > 0 && hasSubstantiveTextThreat) {
    const evasionWeight = 0.18;
    for (const indicator of normalization.obfuscationIndicators) {
      allMatchedKeywords.add(indicator);
    }
    signals.push({
      ruleId: 'RULE_ADVERSARIAL_OBFUSCATION_DETECTED',
      category: 'EVASION_OBFUSCATION',
      weight: evasionWeight,
      description: `Detected deliberate text obfuscation (${normalization.obfuscationIndicators.join(
        ', '
      )}) attempting to evade fraud filters.`,
      matchedKeywords: normalization.obfuscationIndicators
    });
    categoryBreakdown.EVASION_OBFUSCATION = evasionWeight;
  }

  // 2. Evaluate structured transaction telemetry heuristics
  let feeTierViolation: ScamParserEvaluation['feeTierViolation'] | undefined;

  if (telemetry) {
    const isRoutineEstablishedMerchant =
      telemetry.operationType === 'merchant_payment' &&
      !telemetry.isNewlyAddedRecipient &&
      telemetry.recipientAccountAgeDays >= 30;

    // 2a. Newly created / burner recipient account (< 7 days old)
    if (
      !isRoutineEstablishedMerchant &&
      telemetry.recipientAccountAgeDays >= 0 &&
      telemetry.recipientAccountAgeDays < 7 &&
      telemetry.amountZar > 0
    ) {
      const weight = telemetry.recipientAccountAgeDays <= 1 ? 0.28 : 0.18;
      const label = `recipient_account_age_${telemetry.recipientAccountAgeDays}d`;
      allMatchedKeywords.add(label);
      signals.push({
        ruleId: 'TELEMETRY_BURNER_ACCOUNT_AGE',
        category: 'TELEMETRY_ANOMALY',
        weight,
        description: `Recipient account (${telemetry.recipientId}) is only ${telemetry.recipientAccountAgeDays} day(s) old — common for mule/burner scam accounts.`,
        matchedKeywords: [label]
      });
      categoryBreakdown.TELEMETRY_ANOMALY = Number(
        (categoryBreakdown.TELEMETRY_ANOMALY + weight).toFixed(3)
      );
    }

    // 2b. Newly added beneficiary
    if (telemetry.isNewlyAddedRecipient && telemetry.amountZar > 0) {
      const hasSocialOrImpersonation =
        categoryBreakdown.SOCIAL_ENGINEERING_URGENCY > 0 ||
        categoryBreakdown.OFFICIAL_IMPERSONATION > 0 ||
        categoryBreakdown.PREDATORY_LENDING_UPFRONT_FEE > 0;
      const weight = hasSocialOrImpersonation
        ? 0.24
        : telemetry.amountZar >= 300
        ? 0.32 // Surfaces passive micro-copy (0.32 in [0.30, 0.69]) without blocking!
        : 0.12;
      allMatchedKeywords.add('newly_added_recipient');
      signals.push({
        ruleId: 'TELEMETRY_NEW_RECIPIENT_RISK',
        category: 'TELEMETRY_ANOMALY',
        weight,
        description:
          'Recipient was added within the last 24 hours with no prior trusted payment history.',
        matchedKeywords: ['newly_added_recipient']
      });
      categoryBreakdown.TELEMETRY_ANOMALY = Number(
        (categoryBreakdown.TELEMETRY_ANOMALY + weight).toFixed(3)
      );
    }

    // 2c. High outbound transfer velocity (rapid panic drains / multiple voucher splits)
    if (telemetry.recentTransferCountLastHour >= 3 && telemetry.amountZar > 0) {
      const weight = telemetry.recentTransferCountLastHour >= 5 ? 0.34 : 0.20;
      const velocityTag = `high_velocity_${telemetry.recentTransferCountLastHour}_tx_1h`;
      allMatchedKeywords.add(velocityTag);
      signals.push({
        ruleId: 'TELEMETRY_HIGH_TRANSFER_VELOCITY',
        category: 'TELEMETRY_ANOMALY',
        weight,
        description: `Unusual transfer velocity: ${telemetry.recentTransferCountLastHour} outbound transfers in the past hour.`,
        matchedKeywords: [velocityTag]
      });
      categoryBreakdown.TELEMETRY_ANOMALY = Number(
        (categoryBreakdown.TELEMETRY_ANOMALY + weight).toFixed(3)
      );
    }

    // 2d. Unregistered micro-lender demanding loan fee
    if (
      telemetry.isRegisteredCreditProvider === false &&
      (telemetry.operationType === 'loan_fee_payment' ||
        categoryBreakdown.PREDATORY_LENDING_UPFRONT_FEE > 0 ||
        categoryBreakdown.PREDATORY_LENDING_UNREALISTIC_RETURN > 0)
    ) {
      const weight = 0.28;
      allMatchedKeywords.add('unregistered_credit_provider');
      signals.push({
        ruleId: 'TELEMETRY_UNREGISTERED_LENDER',
        category: 'PREDATORY_LENDING_UPFRONT_FEE',
        weight,
        description:
          'Recipient is not registered with the National Credit Regulator (NCR) and is soliciting loan-related payments.',
        matchedKeywords: ['unregistered_credit_provider']
      });
      categoryBreakdown.PREDATORY_LENDING_UPFRONT_FEE = Number(
        (categoryBreakdown.PREDATORY_LENDING_UPFRONT_FEE + weight).toFixed(3)
      );
    }

    // 2e. Agent Cash-Out / Cash-In Fee Surcharge Validation
    if (
      (telemetry.operationType === 'cash_out' || telemetry.operationType === 'cash_in') &&
      typeof telemetry.agentFeeChargedZar === 'number' &&
      telemetry.agentFeeChargedZar > 0 &&
      telemetry.amountZar > 0
    ) {
      const officialMaxFeeZar = getOfficialMaxAgentFeeZar(telemetry.amountZar);
      if (telemetry.agentFeeChargedZar > officialMaxFeeZar) {
        const overchargeAmountZar = Number(
          (telemetry.agentFeeChargedZar - officialMaxFeeZar).toFixed(2)
        );
        const overchargeRatio = overchargeAmountZar / Math.max(1, officialMaxFeeZar);
        // Minor R2-R5 rounding surcharge -> Low/Medium passive tier (0.45); double or extreme surcharge -> High block (>= 0.72)
        const weight = overchargeRatio >= 1 ? 0.74 : 0.45;
        const feeTag = `agent_overcharge_R${overchargeAmountZar}`;
        allMatchedKeywords.add(feeTag);

        feeTierViolation = {
          withdrawalAmountZar: telemetry.amountZar,
          chargedFeeZar: telemetry.agentFeeChargedZar,
          officialMaxFeeZar,
          overchargeAmountZar
        };

        signals.push({
          ruleId: 'TELEMETRY_UNAUTHORIZED_AGENT_FEE_TIER',
          category: 'AGENT_FEE_EXTORTION',
          weight,
          description: `Agent fee of R${telemetry.agentFeeChargedZar.toFixed(
            2
          )} exceeds the official maximum tier fee of R${officialMaxFeeZar.toFixed(
            2
          )} for a R${telemetry.amountZar.toFixed(2)} cash operation (overcharged by R${overchargeAmountZar.toFixed(
            2
          )}).`,
          matchedKeywords: [feeTag]
        });
        categoryBreakdown.AGENT_FEE_EXTORTION = Number(
          (categoryBreakdown.AGENT_FEE_EXTORTION + weight).toFixed(3)
        );
      }
    }
  }

  // 3. Compounding Synergy Boosts (multi-vector social engineering)
  let rawScore = signals.reduce((sum, sig) => sum + sig.weight, 0);

  if (
    categoryBreakdown.OFFICIAL_IMPERSONATION > 0 &&
    categoryBreakdown.SOCIAL_ENGINEERING_URGENCY > 0
  ) {
    rawScore += 0.16;
  }

  if (
    categoryBreakdown.PREDATORY_LENDING_UPFRONT_FEE > 0 &&
    categoryBreakdown.PREDATORY_LENDING_UNREALISTIC_RETURN > 0
  ) {
    rawScore += 0.15;
  }

  if (
    categoryBreakdown.PIN_OTP_DISCLOSURE > 0 &&
    (categoryBreakdown.AGENT_FEE_EXTORTION > 0 ||
      categoryBreakdown.OFFICIAL_IMPERSONATION > 0 ||
      categoryBreakdown.SOCIAL_ENGINEERING_URGENCY > 0)
  ) {
    rawScore += 0.18;
  }

  const riskScore = clampScore(rawScore);
  const severity = scoreToSeverity(riskScore);
  const frictionTier = scoreToFrictionTier(riskScore);

  // Build context-aware passive UI micro-copy for Low/Caution risk [0.30, 0.69]
  let passiveMicroCopy: string | null = null;
  if (frictionTier === 'PASSIVE_MICROCOPY') {
    if (feeTierViolation) {
      passiveMicroCopy = `Check official fee schedule: Standard max cash-out fee for R${feeTierViolation.withdrawalAmountZar.toFixed(
        0
      )} is R${feeTierViolation.officialMaxFeeZar.toFixed(0)} (R${feeTierViolation.overchargeAmountZar.toFixed(
        0
      )} above tier).`;
    } else if (telemetry?.isNewlyAddedRecipient) {
      passiveMicroCopy =
        'First-time payment to a newly added contact — double-check the mobile number before sending.';
    } else if (categoryBreakdown.PREDATORY_LENDING_UNREALISTIC_RETURN > 0) {
      passiveMicroCopy =
        'Caution: Verify NCR registration (0860 627 627) and never surrender your SASSA or bank card.';
    } else {
      passiveMicroCopy =
        'Unusual urgency or payment cue spotted — confirm directly by phone if anything feels rushed.';
    }
  } else if (isCompliantAgentFeeContext && telemetry) {
    passiveMicroCopy = `Fee verified: R${telemetry.agentFeeChargedZar?.toFixed(
      0
    )} is within the official R${getOfficialMaxAgentFeeZar(telemetry.amountZar).toFixed(
      0
    )} cash-out tariff.`;
  }

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionTimeMs = Number(Math.max(0.01, endTime - startTime).toFixed(2));

  return {
    riskScore,
    severity,
    frictionTier,
    isBlockedRecommended: riskScore >= 0.70,
    passiveMicroCopy,
    signals,
    shadowSignals,
    suppressedAllowlistNotes,
    matchedKeywords: [...allMatchedKeywords],
    obfuscationIndicators: normalization.obfuscationIndicators,
    categoryBreakdown,
    feeTierViolation,
    executionTimeMs,
    evaluatedAtIso: telemetry?.timestampIso ?? new Date().toISOString()
  };
};
