// ---------------------------------------------------------------------------
// Indian income-tax rules used by the Tax Calculator and Dashboard.
//
// This used to be scattered: slabs hardcoded in utils.js, the FY/AY label
// typed separately into TaxCalculator.jsx and Dashboard.jsx as plain text.
// Nothing enforced that they matched or that anyone would remember to bump
// the label when the year rolled over. Now there's one object with an
// explicit assessment year — when a new year's rules ship, this is the only
// file that needs to change.
//
// NOTE: the backend (a separately deployed app) keeps its own mirrored copy
// at taxRules.js for the AI Advisor's system prompt, and also exposes it at
// GET /api/tax-rules. If frontend and backend are ever deployed so the
// frontend can freely call that endpoint at load time, prefer fetching it
// there instead of maintaining two copies.
// ---------------------------------------------------------------------------

export const TAX_RULES = {
  assessmentYear: "AY 2026-27",
  financialYear: "FY 2025-26",
  label: "FY 2025–26 (AY 2026–27)",
  newRegime: {
    standardDeductionSalaried: 75000,
    slabs: [
      [0, 400000, 0],
      [400000, 800000, 0.05],
      [800000, 1200000, 0.1],
      [1200000, 1600000, 0.15],
      [1600000, 2000000, 0.2],
      [2000000, 2400000, 0.25],
      [2400000, null, 0.3],
    ],
    rebate: { maxTaxableIncome: 1200000, maxRebate: 60000 },
    cessRate: 0.04,
  },
  oldRegime: {
    standardDeductionSalaried: 50000,
    slabsBelow60: [
      [0, 250000, 0],
      [250000, 500000, 0.05],
      [500000, 1000000, 0.2],
      [1000000, null, 0.3],
    ],
    slabsSenior60to80: [
      [0, 300000, 0],
      [300000, 500000, 0.05],
      [500000, 1000000, 0.2],
      [1000000, null, 0.3],
    ],
    slabsSuperSenior80Plus: [
      [0, 500000, 0],
      [500000, 1000000, 0.2],
      [1000000, null, 0.3],
    ],
    rebate: { maxTaxableIncome: 500000, maxRebate: 12500 },
    cessRate: 0.04,
    deductionCaps: {
      section80C: 150000,
      section80DBelow60: 25000,
      section80D60Plus: 50000,
      section80CCD1B: 50000,
    },
  },
};
