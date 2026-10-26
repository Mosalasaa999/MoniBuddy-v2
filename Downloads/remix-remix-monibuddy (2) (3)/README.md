# MoniBuddy

**Offline-First Personal Cash, Micro-Savings, Loan Cap & Scam Shield for South African Informal Earners**

MoniBuddy helps taxi commuters, spaza traders, domestic workers, piece-job earners, and SASSA grant recipients separate everyday spending cash from ring-fenced goal pots and a self-funded 0%-interest emergency buffer — **100% offline, encrypted on-device, with zero user fees and zero mobile data required after load**.

---

## Problem Statement

Millions of South Africans earn irregular cash income while facing three compounding pressures:
1. **Blurred cash boundaries**: Daily taxi fare and electricity cash mixes with month-end school fees, rent, or spaza stock, causing accidental shortfalls.
2. **Predatory short-term credit & mashonisas**: An unexpected R300–R1,000 shock pushes households into unregulated 30%–50%/month mashonisa loans or illegal "loan release fee" traps.
3. **Expensive prepaid mobile data & English-only finance tools**: Apps that depend on cloud APIs, external font CDNs, or complex English banking jargon exclude users when airtime runs out.

---

## Core Architecture & Features

### 1. 100% Offline-First PWA & Zero External Network Dependencies
- **Self-hosted typography**: Variable `Plus Jakarta Sans` and `JetBrains Mono` are bundled locally (`0` external Google Fonts or CDN requests).
- **Workbox Service Worker + Web App Manifest**: Precaches HTML, JS, CSS, WOFF2 fonts, and PWA icons for instant cold-boot in Airplane Mode.
- **Lazy-loaded route chunks**: `PotsOverview` renders eagerly for fast first paint on budget Android devices while secondary modules load via local precached chunks.

### 2. Real On-Device Cryptography & Per-User Isolation (`src/cryptoLedger.ts`)
- **PBKDF2-HMAC-SHA256 PIN Hashing**: Every account PIN is hashed with a unique random 16-byte salt over `100,000` PBKDF2 iterations (`window.crypto.subtle`) and verified in constant time.
- **AES-256-GCM Encrypted Ledger**: Each user's financial ledger (`monibuddy_ledger_v3_<userId>`) is encrypted at rest with a separate random salt and fresh 96-bit IV on every save. Plaintext balances, pot names, and transactions are never written to `localStorage`.
- **PIN Brute-Force Lockout**: Enforces a 60-second lockout after 5 consecutive failed PIN attempts.

### 3. Integer-Cent Ledger Engine (`src/ledgerEngine.ts`)
- **Zero floating-point drift**: All ZAR additions, subtractions, and validations execute in integer cents (`toCents` / `fromCents`).
- **Strict balance invariants**:
  - Pot and Emergency Buffer deposits are validated against `safeToSpend`.
  - Deleting a `pot_deposit`, `pot_withdraw`, `buffer_deposit`, or `buffer_withdraw` transaction reverses the corresponding pot or buffer balance.
  - Deleting a funded Goal Pot automatically records a reversing `pot_withdraw` entry so ring-fenced cash returns cleanly to `Safe-to-Spend`.
  - Overspending renders an explicit negative `Safe-to-Spend` balance and overspend alert rather than masking deficits at `R 0.00`.

### 4. NCA Regulation 42 Short-Term Credit Cap Calculator (`src/components/BufferCredit.tsx`)
- Compares any user-entered loan quote (principal, total repayment or monthly interest %, extra fees, term in days, first vs. repeat loan in calendar year) against statutory **South African National Credit Act (Act 34 of 2005, Regulation 42 Table B)** short-term credit caps:
  - **Interest ceiling**: `5%` per month (first short-term loan in calendar year) or `3%` per month (repeat loan), pro-rated daily.
  - **Initiation fee ceiling**: `R165 + 10%` of amount above `R1,000` (capped at `R1,050` and never exceeding `15%` of principal).
  - **Monthly service fee ceiling**: `R60 / month` (pro-rated for terms under 30 days).
- Highlights illegal overcharges side-by-side against MoniBuddy's `0% APR` self-funded Emergency Buffer, with safer alternatives and an educational non-advice disclaimer.

### 5. Rule-Based Offline Scam Shield (`src/scamParser.ts`, `src/scamDeductionEngine.ts`)
- **Word-boundary & compound heuristic engine**: Normalizes leetspeak, zero-width characters, and punctuation-split evasion (`p@y f.e.e`) while using strict `\b` word boundaries so benign words (`footprint`, `hotpot`, `people`, `pepper`, `job interview`, `post office`) are never false-flagged.
- Covers South African advance-fee loan scams, fake SASSA grant suspension phishing, Mashonisa ATM card/PIN retention (illegal under NCA s90/s133), fake job uniform/medical fee scams, fake SAPO/courier customs fees, and WhatsApp pyramid/gifting stokvels.
- Includes spoken vernacular audio warnings and an explicit disclaimer noting that offline rule-based checks cannot detect every new scam.

### 6. 4-Tier Vernacular Voice & Zero-Data Touch Pad (`src/VoiceRecorder.ts`, `src/SlangDictionary.ts`)
- **Data-safe speech pipeline**: Uses browser speech recognition when supported, protects prepaid cellular airtime by never auto-downloading large models on metered mobile data, and provides an instant **Zero-Typing Touch Pad** with SA slang denominations (`Half Tiger` R5, `Tiger` R10, `Choco` R20, `Pinkies` R50, `Clipa` R100, `Leopard` R200).
- **Disambiguated slang parser**: Accurately parses multi-item vernacular phrases (e.g., `"Two choco for taxi and one clipa for airtime"`, `"taxi to town R32"`, `"pay electricity R100"`, `"got paid R500 wages"`).

### 7. Complete 5-Language Localization & Accessibility
- **100% localized UI & spoken guides**: Complete TypeScript-enforced translations across **English**, **isiZulu**, **isiXhosa**, **Sesotho**, and **Afrikaans** (plus **Sepedi** in Voice & Scam Shield).
- **Accessible by design**: `A+` Large Text toggle (`18px` root scaling), WCAG focus-trapped & `Escape`-dismissible modals, `>= 44px–56px` mobile thumb-zone navigation, `prefers-reduced-motion` support, and zero GPU-heavy `backdrop-blur` filters.

---

## Sustainability & Path to Revenue (Zero Cost to Informal Earners)

MoniBuddy remains **100% free and ad-free for individuals**. Revenue is generated through three B2B2C channels:
1. **Zero-Rated Retail Bank & Telco Licensing**: White-label onboarding funnel for entry-level bank accounts (e.g., FNB Easy Zero) and zero-rated telco portals, lowering customer acquisition and cash-handling costs.
2. **Stokvel, NGO & Municipal Financial-Literacy Sponsorships**: Sponsored community savings drives and scam-prevention campaigns with zero exposure of private user ledgers.
3. **Opt-In NCR-Compliant Micro-Insurance & Goal-Matched Rewards**: Voluntary funeral/stock cover referrals and grocery retailer goal vouchers when users complete savings pots.

---

## Local Setup, Testing & Production Build

```bash
# 1. Install dependencies cleanly
npm install

# 2. Type-check the entire project (strict TypeScript)
npm run lint

# 3. Run the automated verification test suite (Scam Shield, Voice Parser, Crypto, Ledger, NCA Caps, i18n)
npm test

# 4. Build the offline-ready production bundle + Service Worker + Manifest
npm run build

# 5. Start local development server (port 3000)
npm run dev
```

> **Note on the `*120*6664#` USSD View**: The USSD screen inside the app is an interactive **in-app offline prototype simulator** demonstrating how MoniBuddy's ledger actions map to a zero-data USSD gateway once integrated with a South African WASPaggregator.
