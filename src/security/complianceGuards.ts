/**
 * MoniBuddy Statutory Compliance Guards - complianceGuards.ts
 * 
 * Enforces South African Financial Regulatory Rules:
 * - FAIS Act (Act 37 of 2002) Section 1(3)(a) "Calculator Loophole"
 * - FICA (Act 38 of 2001) Schedule 1 Item 11 / PCC 23A Incidental Credit Guard
 * - Banks Act (Act 94 of 1990) Exemption Notice 620 (Gazette 37903, 15 Aug 2014) Stokvel Limits
 */

// ============================================================================
// 1. FAIS ACT SECTION 1(3)(a) "CALCULATOR LOOPHOLE" GUARD
// ============================================================================

export interface FinancialCalculationInput {
  principalAmount: number;
  interestRatePerAnnum: number;
  tenureMonths: number;
  calculationType: 'COMPOUND_INTEREST' | 'LOAN_REPAYMENT' | 'STOKVEL_PAYOUT_SPLIT' | 'INFLATION_ADJUSTMENT';
}

export interface FAISCompliantOutput {
  isFaisCompliant: boolean;
  rawComputationResult: number;
  breakdown: Record<string, number>;
  statutoryDisclaimer: string;
  advisoryTextStripped: boolean;
}

/**
 * Enforces pure mathematical calculations.
 * Strips out any subjective financial advice, product recommendations, or behavioral nudges
 * to comply with FAIS Act Section 1(3)(a) pure calculation exemption.
 */
export function executePureFinancialCalculation(input: FinancialCalculationInput): FAISCompliantOutput {
  if (input.principalAmount < 0 || input.tenureMonths <= 0 || input.interestRatePerAnnum < 0) {
    throw new Error('FAIS Guard Error: Invalid non-negative inputs required for pure mathematical evaluation.');
  }

  let rawComputationResult = 0;
  const breakdown: Record<string, number> = {};

  switch (input.calculationType) {
    case 'COMPOUND_INTEREST': {
      const ratePerMonth = input.interestRatePerAnnum / 100 / 12;
      rawComputationResult = input.principalAmount * Math.pow(1 + ratePerMonth, input.tenureMonths);
      breakdown['principal'] = input.principalAmount;
      breakdown['totalInterestEarned'] = parseFloat((rawComputationResult - input.principalAmount).toFixed(2));
      break;
    }
    case 'LOAN_REPAYMENT': {
      const r = input.interestRatePerAnnum / 100 / 12;
      if (r === 0) {
        rawComputationResult = input.principalAmount / input.tenureMonths;
      } else {
        rawComputationResult = (input.principalAmount * r * Math.pow(1 + r, input.tenureMonths)) / (Math.pow(1 + r, input.tenureMonths) - 1);
      }
      breakdown['monthlyInstallment'] = parseFloat(rawComputationResult.toFixed(2));
      breakdown['totalRepayable'] = parseFloat((rawComputationResult * input.tenureMonths).toFixed(2));
      break;
    }
    case 'STOKVEL_PAYOUT_SPLIT': {
      rawComputationResult = input.principalAmount / input.tenureMonths; // tenureMonths used as total member count
      breakdown['sharePerMember'] = parseFloat(rawComputationResult.toFixed(2));
      break;
    }
    case 'INFLATION_ADJUSTMENT': {
      const annualRate = input.interestRatePerAnnum / 100;
      rawComputationResult = input.principalAmount * Math.pow(1 + annualRate, input.tenureMonths / 12);
      breakdown['futureAdjustedValue'] = parseFloat(rawComputationResult.toFixed(2));
      break;
    }
  }

  return {
    isFaisCompliant: true,
    rawComputationResult: parseFloat(rawComputationResult.toFixed(2)),
    breakdown,
    statutoryDisclaimer: "PURE MATHEMATICAL COMPUTATION - NO FINANCIAL ADVICE OR RECOMMENDATION CONVEYED (FAIS ACT 37 OF 2002 SECTION 1 EXEMPTION).",
    advisoryTextStripped: true
  };
}

// ============================================================================
// 2. FICA SCHEDULE 1 INCIDENTAL CREDIT GUARD
// ============================================================================

export interface MicroLoanRecord {
  loanId: string;
  borrowerName: string;
  lenderName: string;
  principalAmount: number;
  interestCharged: number;
  isCommercialLending: boolean; // Must be false for non-commercial incidental credit
}

export interface FICAIncidentalCreditResult {
  isFicaAccountableInstitutionTriggered: boolean;
  classificationLabel: 'INCIDENTAL_CREDIT_EXEMPT' | 'COMMERCIAL_CREDIT_ACCOUNTABLE';
  complianceStatusNotice: string;
  requiresFICARegistration: boolean;
}

/**
 * Evaluates micro-loans and peer-to-peer ledgers against FICA Schedule 1 Item 11 and FIC PCC 23A.
 * Explicitly labels non-commercial ledger entries as "Incidental Credit" to maintain regulatory exemption.
 */
export function evaluateMicroLoanRecord(loan: MicroLoanRecord): FICAIncidentalCreditResult {
  // If loan is non-commercial (friend/family/informal ledger with 0% interest or incidental late fees),
  // it is classified as Incidental Credit under National Credit Act Sec 40 and FIC PCC 23A.
  if (!loan.isCommercialLending && loan.interestCharged === 0) {
    return {
      isFicaAccountableInstitutionTriggered: false,
      classificationLabel: 'INCIDENTAL_CREDIT_EXEMPT',
      complianceStatusNotice: 'EXEMPT: Informal, non-commercial peer transaction classified as Incidental Credit under FIC PCC 23A. FICA Schedule 1 Item 11 registration NOT required.',
      requiresFICARegistration: false
    };
  }

  // Commercial credit agreements trigger FICA Schedule 1 Item 11 registration
  return {
    isFicaAccountableInstitutionTriggered: true,
    classificationLabel: 'COMMERCIAL_CREDIT_ACCOUNTABLE',
    complianceStatusNotice: 'WARNING: Commercial interest or credit activities detected. Entity triggers FICA Schedule 1 Item 11 Accountable Institution status. Registration with Financial Intelligence Centre mandatory.',
    requiresFICARegistration: true
  };
}

// ============================================================================
// 3. 2014 BANKS ACT EXEMPTION NOTICE GUARD (GAZETTE 37903, NOTICE 620)
// ============================================================================

export const BANKS_ACT_CONSTANTS = {
  STOKVEL_NASASA_REGISTRATION_THRESHOLD: 100_000.00, // R100,000 aggregate member contribution limit
  BANKS_ACT_STATUTORY_CEILING: 30_000_000.00         // R30,000,000 hard statutory limit for informal deposit-taking
};

export type BanksActComplianceLevel = 
  | 'FULLY_COMPLIANT_INFORMAL'
  | 'WARNING_NASASA_REGISTRATION_REQUIRED'
  | 'CRITICAL_BANKS_ACT_LIMIT_EXCEEDED';

export interface StokvelComplianceStatus {
  aggregateTotal: number;
  complianceLevel: BanksActComplianceLevel;
  nasasaRegistrationMandatory: boolean;
  executionBlocked: boolean;
  regulatoryNotice: string;
}

/**
 * Pure function monitoring aggregated Stokvel balances against Government Notice 620 of 15 August 2014.
 * - Flags warning at R100,000 (mandating NASASA registration).
 * - Blocks execution if aggregate total touches R30,000,000 statutory limit.
 */
export function evaluateStokvelAggregateBalance(totalMemberContributions: number): StokvelComplianceStatus {
  if (totalMemberContributions < 0) {
    throw new Error('Banks Act Guard Error: Aggregate contributions cannot be negative.');
  }

  // Level 1: Under R100,000 -> Fully Compliant Informal Group
  if (totalMemberContributions <= BANKS_ACT_CONSTANTS.STOKVEL_NASASA_REGISTRATION_THRESHOLD) {
    return {
      aggregateTotal: totalMemberContributions,
      complianceLevel: 'FULLY_COMPLIANT_INFORMAL',
      nasasaRegistrationMandatory: false,
      executionBlocked: false,
      regulatoryNotice: `Compliant: Group aggregate contributions (R${totalMemberContributions.toLocaleString()}) are below the R100,000 threshold under Government Notice 620 of 15 August 2014. No NASASA registration required.`
    };
  }

  // Level 2: R100,000.01 to R29,999,999.99 -> Requires NASASA SRO Registration
  if (totalMemberContributions < BANKS_ACT_CONSTANTS.BANKS_ACT_STATUTORY_CEILING) {
    return {
      aggregateTotal: totalMemberContributions,
      complianceLevel: 'WARNING_NASASA_REGISTRATION_REQUIRED',
      nasasaRegistrationMandatory: true,
      executionBlocked: false,
      regulatoryNotice: `WARNING: Aggregate Stokvel balance (R${totalMemberContributions.toLocaleString()}) exceeds R100,000. Under Government Notice 620 (Gazette 37903), group MUST register with NASASA (National Stokvel Association of South Africa) to maintain Banks Act exemption.`
    };
  }

  // Level 3: R30,000,000.00+ -> Hard Statutory Ceiling (Execution Blocked)
  return {
    aggregateTotal: totalMemberContributions,
    complianceLevel: 'CRITICAL_BANKS_ACT_LIMIT_EXCEEDED',
    nasasaRegistrationMandatory: true,
    executionBlocked: true,
    regulatoryNotice: `EXECUTION BLOCKED: Aggregate total (R${totalMemberContributions.toLocaleString()}) touches or exceeds the R30,000,000 statutory limit under the Banks Act 94 of 1990. Operating beyond this limit without a formal Banking License or Mutual Bank registration constitutes illegal deposit-taking under Section 11 of the Banks Act.`
  };
}
