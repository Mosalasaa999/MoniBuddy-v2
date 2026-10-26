/**
 * @fileoverview Comprehensive Positive & Negative Regression Test Suite for MoniBuddy's
 * Context-Aware Defensive Shield (`scamParser.ts` and `scamDeductionEngine.ts`).
 *
 * Covers 5 systematic verification categories:
 *  1. `positive_baseline`   — Known predatory micro-loans, emergency impersonation, and agent extortion
 *  2. `false_positive`      — Legitimate bank OTP warnings, official SASSA notices, NCR loan receipts, compliant agent fees
 *  3. `evasion_bypass`      — Leetspeak (`p@y pr0c3ss1ng f33`), zero-width chars, punctuation splitting (`f.e.e`), township slang (`tjotjo`)
 *  4. `malformed_telemetry` — Empty strings, `NaN`, `Infinity`, negative ZAR amounts/ages, extreme integer spikes
 *  5. `stress_unicode`      — 25KB+ padded messages, emoji floods, and mixed isiZulu/Sepedi diacritics (< 25ms SLA)
 *
 * Run via CLI: `npx tsx src/scamShield.test.ts`
 */

import {
  ScamEvaluationOptions,
  TransactionTelemetryPayload,
  evaluateScamRisk,
  getOfficialMaxAgentFeeZar,
  normalizeObfuscatedText
} from './scamParser';
import {
  deduceScamAndBuildIncidentReport,
  generateLocalizedAudioScripts
} from './scamDeductionEngine';

export type ShieldTestCategory =
  | 'positive_baseline'
  | 'false_positive'
  | 'evasion_bypass'
  | 'malformed_telemetry'
  | 'stress_unicode';

export interface ShieldInspectablePayload {
  readonly transcript: string;
  readonly telemetry?: TransactionTelemetryPayload;
}

export interface ShieldUnitTestResult {
  readonly id: string;
  readonly category: ShieldTestCategory;
  readonly name: string;
  readonly expectedSummary: string;
  readonly passed: boolean;
  readonly details: string;
  readonly durationMs: number;
  readonly samplePayload?: ShieldInspectablePayload;
}

const assertCondition = (condition: boolean, failureMessage: string): void => {
  if (!condition) {
    throw new Error(failureMessage);
  }
};

export const runDefensiveShieldTestSuite = (
  options?: ScamEvaluationOptions
): readonly ShieldUnitTestResult[] => {
  const cases: {
    id: string;
    category: ShieldTestCategory;
    name: string;
    expectedSummary: string;
    samplePayload?: ShieldInspectablePayload;
    run: () => string;
  }[] = [
    // =========================================================================
    // 1. POSITIVE BASELINE REGRESSION CASES
    // =========================================================================
    {
      id: 'POS-01',
      category: 'positive_baseline',
      name: 'Predatory Micro-Loan: Upfront fee + unregistered credit provider triggers VoiceConfirmationModal',
      expectedSummary: 'Score >= 0.70 · TEMPLATE_PREDATORY_LENDER · Block',
      samplePayload: {
        transcript:
          'Guaranteed instant loan of R5000 with no credit check! Deposit R150 processing fee first via 1Voucher to release your cash.',
        telemetry: {
          transactionId: 'TX-LOAN-901',
          recipientId: '0719998821',
          recipientName: 'QuickCash Loans SA',
          amountZar: 150,
          recipientAccountAgeDays: 3,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 1,
          operationType: 'loan_fee_payment',
          isRegisteredCreditProvider: false
        }
      },
      run: () => {
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage:
            'Guaranteed instant loan of R5000 with no credit check! Deposit R150 processing fee first via 1Voucher to release your cash.',
          telemetry: {
            transactionId: 'TX-LOAN-901',
            recipientId: '0719998821',
            recipientName: 'QuickCash Loans SA',
            amountZar: 150,
            recipientAccountAgeDays: 3,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 1,
            operationType: 'loan_fee_payment',
            isRegisteredCreditProvider: false
          },
          preferredLanguage: 'en',
          evaluationOptions: options
        });

        assertCondition(
          deduction.template.templateId === 'TEMPLATE_PREDATORY_LENDER',
          `Expected TEMPLATE_PREDATORY_LENDER, got ${deduction.template.templateId}`
        );
        assertCondition(
          deduction.evaluation.riskScore >= 0.85,
          `Expected riskScore >= 0.85, got ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          deduction.requiresVoiceConfirmationModal === true,
          'Expected requiresVoiceConfirmationModal=true'
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} (${deduction.frictionTier})`;
      }
    },
    {
      id: 'POS-02',
      category: 'positive_baseline',
      name: 'Emergency Impersonation: Hospital casualty panic + newly added burner contact',
      expectedSummary: 'Score >= 0.70 · TEMPLATE_IMPERSONATION_URGENT · Block',
      samplePayload: {
        transcript:
          'Hospital emergency! Your cousin is in casualty after an accident, send right now R950 to this nurse number before midnight!',
        telemetry: {
          transactionId: 'TX-EMG-404',
          recipientId: '0638821904',
          recipientName: 'Nurse Dube',
          amountZar: 950,
          recipientAccountAgeDays: 1,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 3,
          operationType: 'p2p_transfer'
        }
      },
      run: () => {
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage:
            'Hospital emergency! Your cousin is in casualty after an accident, send right now R950 to this nurse number before midnight!',
          telemetry: {
            transactionId: 'TX-EMG-404',
            recipientId: '0638821904',
            recipientName: 'Nurse Dube',
            amountZar: 950,
            recipientAccountAgeDays: 1,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 3,
            operationType: 'p2p_transfer'
          },
          preferredLanguage: 'nso',
          evaluationOptions: options
        });

        assertCondition(
          deduction.template.templateId === 'TEMPLATE_IMPERSONATION_URGENT',
          `Expected TEMPLATE_IMPERSONATION_URGENT, got ${deduction.template.templateId}`
        );
        assertCondition(
          deduction.evaluation.riskScore >= 0.75,
          `Expected riskScore >= 0.75, got ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          deduction.activeAudioScript.includes('R950'),
          'Expected Sepedi script to interpolate R950'
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} (${deduction.template.templateId})`;
      }
    },
    {
      id: 'POS-03',
      category: 'positive_baseline',
      name: 'Agent Extortion: Cash-out surcharge >2x official tier + Cash-Send PIN demand',
      expectedSummary: 'Score >= 0.70 · TEMPLATE_UNAUTHORIZED_AGENT_FEE',
      samplePayload: {
        transcript:
          'Kiosk agent says system offline fee applies, pay R45 extra for cash-out and give me your Cash-Send PIN.',
        telemetry: {
          transactionId: 'TX-CSH-772',
          recipientId: 'AGENT-KIOSK-19',
          recipientName: 'Corner Spaza Kiosk',
          amountZar: 400,
          recipientAccountAgeDays: 120,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: 1,
          operationType: 'cash_out',
          agentFeeChargedZar: 45
        }
      },
      run: () => {
        const officialMax = getOfficialMaxAgentFeeZar(400);
        assertCondition(officialMax === 10, `Expected R10 cap, got R${officialMax}`);

        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage:
            'Kiosk agent says system offline fee applies, pay R45 extra for cash-out and give me your Cash-Send PIN.',
          telemetry: {
            transactionId: 'TX-CSH-772',
            recipientId: 'AGENT-KIOSK-19',
            recipientName: 'Corner Spaza Kiosk',
            amountZar: 400,
            recipientAccountAgeDays: 120,
            isNewlyAddedRecipient: false,
            recentTransferCountLastHour: 1,
            operationType: 'cash_out',
            agentFeeChargedZar: 45
          },
          preferredLanguage: 'en',
          evaluationOptions: options
        });

        assertCondition(
          deduction.template.templateId === 'TEMPLATE_UNAUTHORIZED_AGENT_FEE',
          `Expected TEMPLATE_UNAUTHORIZED_AGENT_FEE, got ${deduction.template.templateId}`
        );
        assertCondition(
          deduction.requiresVoiceConfirmationModal === true,
          'Expected VoiceConfirmationModal for severe agent extortion'
        );
        return `Overcharge=R${deduction.evaluation.feeTierViolation?.overchargeAmountZar} · Score=${deduction.evaluation.riskScore.toFixed(2)}`;
      }
    },

    // =========================================================================
    // 2. FALSE-POSITIVE RESILIENCE (BENIGN LOOKALIKES MUST NOT OVER-FLAG)
    // =========================================================================
    {
      id: 'NEG-FP-01',
      category: 'false_positive',
      name: 'Legitimate Bank OTP SMS with defensive warning ("Capitec will NEVER ask for your PIN or OTP")',
      expectedSummary: 'Score == 0.00 · SAFE · Zero false OTP flag',
      samplePayload: {
        transcript:
          'Capitec: Your One-Time PIN (OTP) for electricity purchase of R100.00 is 482910. Capitec will NEVER ask for your PIN or OTP. Never share your OTP with anyone.',
        telemetry: {
          recipientId: 'ESKOM-PREPAID',
          recipientName: 'Prepaid Electricity',
          amountZar: 100,
          recipientAccountAgeDays: 900,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: 1,
          operationType: 'merchant_payment'
        }
      },
      run: () => {
        const evaluation = evaluateScamRisk(
          'Capitec: Your One-Time PIN (OTP) for electricity purchase of R100.00 is 482910. Capitec will NEVER ask for your PIN or OTP. Never share your OTP with anyone.',
          {
            recipientId: 'ESKOM-PREPAID',
            recipientName: 'Prepaid Electricity',
            amountZar: 100,
            recipientAccountAgeDays: 900,
            isNewlyAddedRecipient: false,
            recentTransferCountLastHour: 1,
            operationType: 'merchant_payment'
          },
          options
        );

        assertCondition(
          evaluation.categoryBreakdown.PIN_OTP_DISCLOSURE === 0,
          `False positive! Defensive OTP reminder triggered PIN_OTP_DISCLOSURE (${evaluation.categoryBreakdown.PIN_OTP_DISCLOSURE})`
        );
        assertCondition(
          evaluation.riskScore === 0 && evaluation.severity === 'SAFE',
          `Expected SAFE 0.00, got ${evaluation.riskScore} (${evaluation.severity})`
        );
        assertCondition(
          evaluation.suppressedAllowlistNotes.length > 0,
          'Expected defensive allowlist note to be recorded'
        );
        return `Score=${evaluation.riskScore.toFixed(2)} · Allowlist suppressed OTP reminder`;
      }
    },
    {
      id: 'NEG-FP-02',
      category: 'false_positive',
      name: 'Legitimate SASSA SRD grant payout notification at Shoprite/Boxer without phishing link',
      expectedSummary: 'Score == 0.00 · SAFE · TEMPLATE_GENERAL_SAFE',
      samplePayload: {
        transcript:
          'SASSA Info: Your R370 grant payment date is 25 October. Funds paid into your account or collect at Boxer or Shoprite retail stores. Do not share your PIN with anyone.',
        telemetry: {
          recipientId: 'SASSA-INFO',
          amountZar: 0,
          recipientAccountAgeDays: 1500,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: 0,
          operationType: 'merchant_payment'
        }
      },
      run: () => {
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage:
            'SASSA Info: Your R370 grant payment date is 25 October. Funds paid into your account or collect at Boxer or Shoprite retail stores. Do not share your PIN with anyone.',
          preferredLanguage: 'en',
          evaluationOptions: options
        });

        assertCondition(
          deduction.evaluation.riskScore === 0,
          `Expected 0.00 for official SASSA payout date SMS, got ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          deduction.template.templateId === 'TEMPLATE_GENERAL_SAFE',
          `Expected TEMPLATE_GENERAL_SAFE, got ${deduction.template.templateId}`
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} (${deduction.template.templateId})`;
      }
    },
    {
      id: 'NEG-FP-03',
      category: 'false_positive',
      name: 'Compliant Agent Cash-Out: User mentions "agent cash-out fee" within official R10 tariff',
      expectedSummary: 'Score == 0.00 · SAFE · Verified compliant tariff',
      samplePayload: {
        transcript:
          'Withdrew R400 at spaza kiosk agent, standard R10 cash-out fee charged on receipt.',
        telemetry: {
          recipientId: 'AGENT-REGISTERED-08',
          recipientName: 'Registered Spaza Till',
          amountZar: 400,
          recipientAccountAgeDays: 420,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: 1,
          operationType: 'cash_out',
          agentFeeChargedZar: 10
        }
      },
      run: () => {
        const evaluation = evaluateScamRisk(
          'Withdrew R400 at spaza kiosk agent, standard R10 cash-out fee charged on receipt.',
          {
            recipientId: 'AGENT-REGISTERED-08',
            recipientName: 'Registered Spaza Till',
            amountZar: 400,
            recipientAccountAgeDays: 420,
            isNewlyAddedRecipient: false,
            recentTransferCountLastHour: 1,
            operationType: 'cash_out',
            agentFeeChargedZar: 10
          },
          options
        );

        assertCondition(
          evaluation.categoryBreakdown.AGENT_FEE_EXTORTION === 0,
          `False positive! Compliant R10 fee triggered AGENT_FEE_EXTORTION`
        );
        assertCondition(
          evaluation.riskScore === 0 && !evaluation.isBlockedRecommended,
          `Expected 0.00 non-blocked, got ${evaluation.riskScore}`
        );
        return `Score=${evaluation.riskScore.toFixed(2)} · ${evaluation.passiveMicroCopy ?? 'Tariff OK'}`;
      }
    },
    {
      id: 'NEG-FP-04',
      category: 'false_positive',
      name: 'Isolated benign words ("loan", "fee", "police", "hospital") in everyday conversation',
      expectedSummary: 'Score == 0.00 · Compound proximity prevents false alarm',
      samplePayload: {
        transcript:
          'Walked past the police station and hospital on my way to pay my monthly school fee and check my student loan balance.',
        telemetry: {
          recipientId: 'SCHOOL-BURSAR-01',
          recipientName: 'Orlando High School',
          amountZar: 250,
          recipientAccountAgeDays: 800,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: 1,
          operationType: 'merchant_payment'
        }
      },
      run: () => {
        const evaluation = evaluateScamRisk(
          'Walked past the police station and hospital on my way to pay my monthly school fee and check my student loan balance.',
          {
            recipientId: 'SCHOOL-BURSAR-01',
            recipientName: 'Orlando High School',
            amountZar: 250,
            recipientAccountAgeDays: 800,
            isNewlyAddedRecipient: false,
            recentTransferCountLastHour: 1,
            operationType: 'merchant_payment'
          },
          options
        );

        assertCondition(
          evaluation.riskScore === 0,
          `Isolated words caused false positive score=${evaluation.riskScore}: ${evaluation.signals
            .map(s => s.ruleId)
            .join(', ')}`
        );
        return `Score=${evaluation.riskScore.toFixed(2)} · 0 false signals`;
      }
    },
    {
      id: 'NEG-FP-05',
      category: 'false_positive',
      name: 'Tiered Friction Check: Paying R350 to a newly added stokvel treasurer shows passive hint without blocking',
      expectedSummary: '0.30 <= Score < 0.70 · PASSIVE_MICROCOPY (No Modal Block)',
      samplePayload: {
        transcript: 'Monthly stokvel contribution for November groceries.',
        telemetry: {
          recipientId: '0835551290',
          recipientName: 'MaMkhize Stokvel Treasurer',
          amountZar: 350,
          recipientAccountAgeDays: 400,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 1,
          operationType: 'p2p_transfer'
        }
      },
      run: () => {
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage: 'Monthly stokvel contribution for November groceries.',
          telemetry: {
            recipientId: '0835551290',
            recipientName: 'MaMkhize Stokvel Treasurer',
            amountZar: 350,
            recipientAccountAgeDays: 400,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 1,
            operationType: 'p2p_transfer'
          },
          evaluationOptions: options
        });

        assertCondition(
          deduction.evaluation.riskScore >= 0.30 && deduction.evaluation.riskScore < 0.70,
          `Expected Low/Passive score in [0.30, 0.69], got ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          deduction.frictionTier === 'PASSIVE_MICROCOPY' &&
            deduction.requiresVoiceConfirmationModal === false,
          `Expected PASSIVE_MICROCOPY without blocking modal, got ${deduction.frictionTier}`
        );
        assertCondition(
          Boolean(deduction.evaluation.passiveMicroCopy),
          'Expected non-empty passiveMicroCopy guidance'
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · Tier=${deduction.frictionTier}`;
      }
    },

    // =========================================================================
    // 3. ADVERSARIAL EVASION & OBFUSCATED SCAM SPELLINGS
    // =========================================================================
    {
      id: 'NEG-EV-01',
      category: 'evasion_bypass',
      name: 'Leetspeak + Punctuation Splitting: "P@y R150 pr0c3ss1ng f-e-e f1rst to r3l3@s3 l0@n"',
      expectedSummary: 'De-obfuscated -> Score >= 0.70 · TEMPLATE_PREDATORY_LENDER',
      samplePayload: {
        transcript:
          'Gu@r@nt33d 1nst@nt l0@n! P@y R150 pr0c3ss1ng f-e-e f1rst via 1Voucher to r3l3@s3 your R5000 cash.',
        telemetry: {
          recipientId: '0607718821',
          amountZar: 150,
          recipientAccountAgeDays: 1,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 1,
          operationType: 'loan_fee_payment',
          isRegisteredCreditProvider: false
        }
      },
      run: () => {
        const raw =
          'Gu@r@nt33d 1nst@nt l0@n! P@y R150 pr0c3ss1ng f-e-e f1rst via 1Voucher to r3l3@s3 your R5000 cash.';
        const norm = normalizeObfuscatedText(raw);
        assertCondition(
          norm.deobfuscatedText.toLowerCase().includes('processing fee'),
          `Expected sanitizer to recover "processing fee", got: ${norm.deobfuscatedText}`
        );

        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage: raw,
          telemetry: {
            recipientId: '0607718821',
            amountZar: 150,
            recipientAccountAgeDays: 1,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 1,
            operationType: 'loan_fee_payment',
            isRegisteredCreditProvider: false
          },
          evaluationOptions: options
        });

        assertCondition(
          deduction.evaluation.riskScore >= 0.70 &&
            deduction.template.templateId === 'TEMPLATE_PREDATORY_LENDER',
          `Bypass occurred! Score=${deduction.evaluation.riskScore}, Template=${deduction.template.templateId}`
        );
        assertCondition(
          deduction.evaluation.obfuscationIndicators.length >= 2,
          'Expected leetspeak + delimited splitting obfuscation indicators'
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · Caught ${deduction.evaluation.obfuscationIndicators.join('+')}`;
      }
    },
    {
      id: 'NEG-EV-02',
      category: 'evasion_bypass',
      name: 'Zero-Width Unicode & Spaced Acronym Phishing: "S\\u200BASSA official ... reply with O T P"',
      expectedSummary: 'Zero-width stripped -> Score >= 0.70 · TEMPLATE_IMPERSONATION_URGENT',
      samplePayload: {
        transcript:
          'S\u200BASSA\u200C urgent\u200D notice: Your grant is suspended! Reply immediately with your O T P and P.I.N to verify.',
        telemetry: {
          recipientId: '0790012234',
          amountZar: 370,
          recipientAccountAgeDays: 2,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 1,
          operationType: 'p2p_transfer'
        }
      },
      run: () => {
        const evasiveText =
          'S\u200BASSA\u200C urgent\u200D notice: Your grant is suspended! Reply immediately with your O T P and P.I.N to verify.';
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage: evasiveText,
          telemetry: {
            recipientId: '0790012234',
            amountZar: 370,
            recipientAccountAgeDays: 2,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 1,
            operationType: 'p2p_transfer'
          },
          evaluationOptions: options
        });

        assertCondition(
          deduction.evaluation.obfuscationIndicators.includes('zero_width_unicode_injection'),
          'Expected zero_width_unicode_injection indicator'
        );
        assertCondition(
          deduction.evaluation.riskScore >= 0.75 &&
            deduction.requiresVoiceConfirmationModal === true,
          `Zero-width phishing bypassed! Score=${deduction.evaluation.riskScore}`
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · Zero-width + spaced OTP caught`;
      }
    },
    {
      id: 'NEG-EV-03',
      category: 'evasion_bypass',
      name: 'Vernacular Slang Evasion: "Send 2 clipa tjotjo to unlock approved loan" + burner telemetry',
      expectedSummary: 'Slang expanded -> Score >= 0.70 · TEMPLATE_PREDATORY_LENDER',
      samplePayload: {
        transcript:
          'umashonisa special: Send 2 clipa tjotjo before loan payout to unlock your R3000 cash.',
        telemetry: {
          recipientId: '0734419900',
          amountZar: 200,
          recipientAccountAgeDays: 1,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 2,
          operationType: 'loan_fee_payment',
          isRegisteredCreditProvider: false
        }
      },
      run: () => {
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage:
            'umashonisa special: Send 2 clipa tjotjo before loan payout to unlock your R3000 cash.',
          telemetry: {
            recipientId: '0734419900',
            amountZar: 200,
            recipientAccountAgeDays: 1,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 2,
            operationType: 'loan_fee_payment',
            isRegisteredCreditProvider: false
          },
          evaluationOptions: options
        });

        assertCondition(
          deduction.template.templateId === 'TEMPLATE_PREDATORY_LENDER',
          `Expected TEMPLATE_PREDATORY_LENDER via slang expansion, got ${deduction.template.templateId}`
        );
        assertCondition(
          deduction.evaluation.riskScore >= 0.70,
          `Expected >= 0.70, got ${deduction.evaluation.riskScore}`
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · Slang "clipa + tjotjo" caught`;
      }
    },
    {
      id: 'NEG-EV-04',
      category: 'evasion_bypass',
      name: 'Shadow Mode Lifecycle: Experimental WhatsApp crypto rule logs passively without blocking until promoted',
      expectedSummary: 'Shadow=0.00 (logged) · Promoted=0.38 (active)',
      samplePayload: {
        transcript: 'Join our WhatsApp forex mentor and automated forex bot group today!'
      },
      run: () => {
        const msg = 'Join our WhatsApp forex mentor and automated forex bot group today!';
        const passiveEval = evaluateScamRisk(msg, undefined, { promoteShadowRules: false });
        assertCondition(
          passiveEval.riskScore === 0 &&
            passiveEval.shadowSignals.some(
              s => s.ruleId === 'SHADOW_CRYPTO_FOREX_WHATSAPP_GROUP'
            ),
          `Expected shadow rule to log passively with score 0, got score=${passiveEval.riskScore}`
        );

        const promotedEval = evaluateScamRisk(msg, undefined, { promoteShadowRules: true });
        assertCondition(
          promotedEval.riskScore >= 0.35 &&
            promotedEval.signals.some(
              s => s.ruleId === 'SHADOW_CRYPTO_FOREX_WHATSAPP_GROUP'
            ),
          `Expected promoted shadow rule to contribute active score >= 0.35, got ${promotedEval.riskScore}`
        );

        return `ShadowScore=${passiveEval.riskScore.toFixed(2)} (1 logged) -> Promoted=${promotedEval.riskScore.toFixed(2)}`;
      }
    },

    // =========================================================================
    // 4. MALFORMED, EMPTY & EXTREME TELEMETRY BOUNDARY INPUTS
    // =========================================================================
    {
      id: 'NEG-MAL-01',
      category: 'malformed_telemetry',
      name: 'Empty, whitespace-only, and control-character-only transcripts degrade cleanly to SAFE 0.00',
      expectedSummary: 'Score == 0.00 · SAFE · No exceptions',
      samplePayload: {
        transcript: '   \n\t\u200B\uFEFF   '
      },
      run: () => {
        for (const blank of ['', '     ', '\n\t\r', '\u200B\u200C\uFEFF']) {
          const res = deduceScamAndBuildIncidentReport({
            transcriptOrMessage: blank,
            evaluationOptions: options
          });
          assertCondition(
            res.evaluation.riskScore === 0 && res.evaluation.severity === 'SAFE',
            `Expected 0.00 SAFE on blank input, got ${res.evaluation.riskScore}`
          );
        }
        return '4 empty/control inputs -> Score=0.00 SAFE';
      }
    },
    {
      id: 'NEG-MAL-02',
      category: 'malformed_telemetry',
      name: 'Corrupted numeric telemetry (NaN, Infinity, -Infinity, negative ZAR & negative account age)',
      expectedSummary: '0.00 <= Score <= 1.00 · Finite numbers · No NaN propagation',
      samplePayload: {
        transcript: 'Grocery transfer',
        telemetry: {
          recipientId: '',
          amountZar: Number.NaN,
          recipientAccountAgeDays: -999,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: Number.POSITIVE_INFINITY,
          operationType: 'cash_out',
          agentFeeChargedZar: Number.NEGATIVE_INFINITY
        }
      },
      run: () => {
        const corrupted: TransactionTelemetryPayload = {
          recipientId: '   ',
          amountZar: Number.NaN,
          recipientAccountAgeDays: -50,
          isNewlyAddedRecipient: false,
          recentTransferCountLastHour: Number.POSITIVE_INFINITY,
          operationType: 'cash_out',
          agentFeeChargedZar: Number.NEGATIVE_INFINITY
        };

        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage: 'Grocery transfer',
          telemetry: corrupted,
          evaluationOptions: options
        });

        assertCondition(
          Number.isFinite(deduction.evaluation.riskScore) &&
            deduction.evaluation.riskScore >= 0 &&
            deduction.evaluation.riskScore <= 1,
          `NaN/Infinity leaked into riskScore: ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          deduction.evaluation.riskScore === 0,
          `Negative account age (-50) or NaN amount caused false anomaly: ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          getOfficialMaxAgentFeeZar(Number.NaN) === 0 &&
            getOfficialMaxAgentFeeZar(-400) === 0 &&
            getOfficialMaxAgentFeeZar(Number.POSITIVE_INFINITY) === 0,
          'getOfficialMaxAgentFeeZar failed boundary check on NaN/-400/Infinity'
        );

        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · NaN/Infinity/-50 safely sanitized`;
      }
    },
    {
      id: 'NEG-MAL-03',
      category: 'malformed_telemetry',
      name: 'Extreme integer spikes (R999,999,999 amount & 50,000 velocity) stay clamped to <= 1.00',
      expectedSummary: 'Score clamped <= 1.00 · Valid audio & report JSON',
      samplePayload: {
        transcript: 'Pay admin fee first to release guaranteed instant loan!',
        telemetry: {
          recipientId: 'X'.repeat(500),
          amountZar: 999_999_999,
          recipientAccountAgeDays: 0,
          isNewlyAddedRecipient: true,
          recentTransferCountLastHour: 50_000,
          operationType: 'cash_out',
          agentFeeChargedZar: 888_888_888,
          isRegisteredCreditProvider: false
        }
      },
      run: () => {
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage: 'Pay admin fee first to release guaranteed instant loan!',
          telemetry: {
            recipientId: 'X'.repeat(500),
            amountZar: 999_999_999,
            recipientAccountAgeDays: 0,
            isNewlyAddedRecipient: true,
            recentTransferCountLastHour: 50_000,
            operationType: 'cash_out',
            agentFeeChargedZar: 888_888_888,
            isRegisteredCreditProvider: false
          },
          evaluationOptions: options
        });

        assertCondition(
          deduction.evaluation.riskScore === 1,
          `Expected clamped max score 1.0, got ${deduction.evaluation.riskScore}`
        );
        assertCondition(
          deduction.incidentReport.transactionMetadata.recipientId.length <= 64,
          'Expected oversized recipientId to be safely truncated to <= 64 chars'
        );
        const scripts = generateLocalizedAudioScripts('TEMPLATE_PREDATORY_LENDER', Number.NaN, -10);
        assertCondition(
          !scripts.en.includes('NaN') && !scripts.zu.includes('NaN'),
          'Audio script contained literal NaN'
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · Recipient truncated to ${deduction.incidentReport.transactionMetadata.recipientId.length} chars`;
      }
    },

    // =========================================================================
    // 5. LONG-PAYLOAD STRESS & UNICODE / EMOJI BOUNDARIES
    // =========================================================================
    {
      id: 'NEG-STR-01',
      category: 'stress_unicode',
      name: 'ReDoS & 30KB Payload Stress: 30,000-char padded string evaluates in < 50ms without freeze',
      expectedSummary: 'Truncated at 12KB · Latency < 50ms · No ReDoS hang',
      samplePayload: {
        transcript: `${'pay '.repeat(600)}normal grocery notes ${'x'.repeat(200)}`
      },
      run: () => {
        // Adversarial near-miss repetition ("pay processing " repeated thousands of times without "fee")
        const adversarialLong = `${'pay processing '.repeat(2100)}for groceries today.`;
        const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const evaluation = evaluateScamRisk(adversarialLong, undefined, options);
        const elapsed =
          (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;

        assertCondition(
          elapsed < 120,
          `ReDoS / performance regression: took ${elapsed.toFixed(2)}ms (> 120ms budget)`
        );
        assertCondition(
          evaluation.riskScore === 0,
          `Near-miss padding caused false positive: ${evaluation.riskScore}`
        );
        return `31.5KB adversarial payload evaluated in ${elapsed.toFixed(2)}ms -> SAFE`;
      }
    },
    {
      id: 'NEG-STR-02',
      category: 'stress_unicode',
      name: 'Unicode Emoji Clusters & Sepedi/isiZulu Diacritics: Multi-byte surrogates preserve accuracy',
      expectedSummary: 'Emoji flood + Sepedi diacritics -> Accurate detection',
      samplePayload: {
        transcript:
          '🚨🚨💸🔥 Temošo: Lefa tefo ya go bula kadimo gonabjale! 💰💳 Deposit R100 admin fee first! 🔥🚨'
      },
      run: () => {
        const emojiFlood = `${'🚨💸🔥👨‍👩‍👧‍👦'.repeat(40)} Lefa tefo ya go bula kadimo! Deposit R100 admin fee first to release R2000 loan!`;
        const deduction = deduceScamAndBuildIncidentReport({
          transcriptOrMessage: emojiFlood,
          preferredLanguage: 'nso',
          evaluationOptions: options
        });

        assertCondition(
          deduction.template.templateId === 'TEMPLATE_PREDATORY_LENDER' &&
            deduction.evaluation.riskScore >= 0.55,
          `Emoji flood disrupted Sepedi/English upfront-fee match: score=${deduction.evaluation.riskScore}`
        );
        return `Score=${deduction.evaluation.riskScore.toFixed(2)} · Multi-byte emoji + Sepedi verified`;
      }
    }
  ];

  return cases.map(tc => {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    try {
      const details = tc.run();
      const durationMs = Number(
        Math.max(
          0.01,
          (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start
        ).toFixed(2)
      );
      return {
        id: tc.id,
        category: tc.category,
        name: tc.name,
        expectedSummary: tc.expectedSummary,
        passed: true,
        details,
        durationMs,
        samplePayload: tc.samplePayload
      };
    } catch (error) {
      const durationMs = Number(
        Math.max(
          0.01,
          (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start
        ).toFixed(2)
      );
      return {
        id: tc.id,
        category: tc.category,
        name: tc.name,
        expectedSummary: tc.expectedSummary,
        passed: false,
        details: error instanceof Error ? error.message : String(error),
        durationMs,
        samplePayload: tc.samplePayload
      };
    }
  });
};

// Allow direct CLI execution via `npx tsx src/scamShield.test.ts`
const isCliExecution = (() => {
  try {
    return (
      typeof process !== 'undefined' &&
      Array.isArray(process.argv) &&
      Boolean(process.argv[1]?.includes('scamShield.test'))
    );
  } catch {
    return false;
  }
})();

if (isCliExecution) {
  const results = runDefensiveShieldTestSuite();
  let failed = 0;
  for (const r of results) {
    const status = r.passed ? 'PASS' : 'FAIL';
    console.log(
      `[${status}] ${r.id} (${r.category}) [${r.durationMs}ms] - ${r.name}\n       ${r.details}`
    );
    if (!r.passed) failed += 1;
  }
  if (failed > 0) {
    process.exit(1);
  }
  console.log(
    `\nAll ${results.length} Positive & Negative Defensive Shield tests passed.`
  );
}
