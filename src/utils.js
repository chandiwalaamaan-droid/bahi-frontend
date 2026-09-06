// ---------- helpers ----------
export const fmt = (n) =>
  (isNaN(n) ? 0 : n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
export const fmtR = (n) => `₹${fmt(Math.round(n || 0))}`;
export const uid = () => Math.random().toString(36).slice(2, 10);
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const monthKey = (iso) => iso.slice(0, 7);
export const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(y, m - 1, 1).toLocaleString("en-IN", { month: "short", year: "2-digit" });
};

// True once the app is already running installed (Android/desktop "standalone"
// display mode, or iOS Safari's own `navigator.standalone` flag) — used to
// hide the "Install app" row so it doesn't show up inside the installed app.
export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// iOS Safari never fires `beforeinstallprompt` — there's no programmatic
// install there, only the manual Share -> Add to Home Screen flow — so the
// install button falls back to showing instructions instead of a real prompt.
export function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}


// Turns an array of same-shaped row objects into a downloadable CSV file,
// e.g. downloadCSV("transactions.csv", txns, ["date","type","category","amount","note"]).
// Handles quoting for commas/quotes/newlines so a note like `Client said "thanks"`
// doesn't corrupt the file.
export function downloadCSV(filename, rows, columns) {
  const escape = (val) => {
    const s = val === null || val === undefined ? "" : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((col) => escape(row[col])).join(","));
  const csv = [header, ...lines].join("\r\n");
  // Prepend a UTF-8 BOM so ₹ and other non-ASCII characters open correctly in Excel.
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

import { TAX_RULES } from "./taxRules";

export function calcSlabTax(income, slabs) {
  let tax = 0;
  for (const [from, to, rate] of slabs) {
    if (income > from) {
      const upper = to === null ? income : Math.min(income, to);
      tax += (upper - from) * rate;
    }
  }
  return Math.max(0, tax);
}

// Re-exported so existing imports of NEW_SLABS (e.g. Dashboard.jsx) keep
// working — the actual numbers now live in taxRules.js.
export const NEW_SLABS = TAX_RULES.newRegime.slabs;

function oldSlabsFor(age) {
  if (age === "senior") return TAX_RULES.oldRegime.slabsSenior60to80;
  if (age === "supersenior") return TAX_RULES.oldRegime.slabsSuperSenior80Plus;
  return TAX_RULES.oldRegime.slabsBelow60;
}

export function computeNewRegime(gross, salaried) {
  const { standardDeductionSalaried, slabs, rebate: rebateRule, cessRate } = TAX_RULES.newRegime;
  const stdDed = salaried ? standardDeductionSalaried : 0;
  const taxable = Math.max(0, gross - stdDed);
  let tax = calcSlabTax(taxable, slabs);
  let rebate = 0;
  if (taxable <= rebateRule.maxTaxableIncome) {
    rebate = Math.min(tax, rebateRule.maxRebate);
    tax = 0;
  }
  const cess = tax * cessRate;
  return { stdDed, taxable, taxBeforeCess: tax, rebate, cess, total: tax + cess };
}

export function computeOldRegime(gross, salaried, age, deductions80c, deductions80d, deductions80ccd, otherDed) {
  const { standardDeductionSalaried, rebate: rebateRule, cessRate, deductionCaps } = TAX_RULES.oldRegime;
  const stdDed = salaried ? standardDeductionSalaried : 0;
  // 80D's cap depends on the taxpayer's own age bracket (60+ gets a higher
  // limit for their own health cover) — previously this was hardcoded to
  // 25,000 for everyone regardless of the age selected above it in the form,
  // which silently under-capped senior citizens' deduction.
  const is60Plus = age === "senior" || age === "supersenior";
  const cap80D = is60Plus ? deductionCaps.section80D60Plus : deductionCaps.section80DBelow60;
  const cappedC = Math.min(deductions80c || 0, deductionCaps.section80C);
  const cappedD = Math.min(deductions80d || 0, cap80D);
  const cappedCcd = Math.min(deductions80ccd || 0, deductionCaps.section80CCD1B);
  const taxable = Math.max(0, gross - stdDed - cappedC - cappedCcd - cappedD - (otherDed || 0));
  let tax = calcSlabTax(taxable, oldSlabsFor(age));
  let rebate = 0;
  if (taxable <= rebateRule.maxTaxableIncome) {
    rebate = Math.min(tax, rebateRule.maxRebate);
    tax = 0;
  }
  const cess = tax * cessRate;
  return { stdDed, cappedC, cappedD, cap80D, cappedCcd, taxable, taxBeforeCess: tax, rebate, cess, total: tax + cess };
}

// ---------- API ----------
const API = import.meta.env.VITE_API_URL || "";
export const TOKEN_KEY = "bahi_token";
export const DARK_MODE_KEY = "bahi_dark_mode";

// ---------- Dark mode ----------
export function getDarkMode() {
  const saved = localStorage.getItem(DARK_MODE_KEY);
  if (saved !== null) return saved === "true";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyDarkMode(dark) {
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem(DARK_MODE_KEY, "true");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem(DARK_MODE_KEY, "false");
  }
}

let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(r, path, method) {
  if (r.status === 401) {
    onUnauthorized();
    throw new Error("Session expired — please sign in again.");
  }
  if (!r.ok) {
    let msg = `${method} ${path} failed`;
    try {
      const body = await r.json();
      if (body?.error) msg = body.error;
    } catch {
      // ignore — not JSON
    }
    throw new Error(msg);
  }
  return r.json();
}

export async function apiGet(path) {
  const r = await fetch(`${API}/api${path}`, { headers: { ...authHeaders() } });
  return handleResponse(r, path, "GET");
}

export async function apiPost(path, body) {
  const r = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse(r, path, "POST");
}

export async function apiPut(path, body) {
  const r = await fetch(`${API}/api${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse(r, path, "PUT");
}

export async function apiDelete(path) {
  const r = await fetch(`${API}/api${path}`, { method: "DELETE", headers: { ...authHeaders() } });
  return handleResponse(r, path, "DELETE");
}

export async function apiPatch(path, body) {
  const r = await fetch(`${API}/api${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse(r, path, "PATCH");
}

// Auth calls never send a token (register/login issue one).
export async function apiAuth(path, body) {
  const r = await fetch(`${API}/api/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(r, path, "POST");
}
