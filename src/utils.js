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

export const NEW_SLABS = [
  [0, 400000, 0],
  [400000, 800000, 0.05],
  [800000, 1200000, 0.1],
  [1200000, 1600000, 0.15],
  [1600000, 2000000, 0.2],
  [2000000, 2400000, 0.25],
  [2400000, null, 0.3],
];

function oldSlabsFor(age) {
  if (age === "senior") {
    return [
      [0, 300000, 0],
      [300000, 500000, 0.05],
      [500000, 1000000, 0.2],
      [1000000, null, 0.3],
    ];
  }
  if (age === "supersenior") {
    return [
      [0, 500000, 0],
      [500000, 1000000, 0.2],
      [1000000, null, 0.3],
    ];
  }
  return [
    [0, 250000, 0],
    [250000, 500000, 0.05],
    [500000, 1000000, 0.2],
    [1000000, null, 0.3],
  ];
}

export function computeNewRegime(gross, salaried) {
  const stdDed = salaried ? 75000 : 0;
  const taxable = Math.max(0, gross - stdDed);
  let tax = calcSlabTax(taxable, NEW_SLABS);
  let rebate = 0;
  if (taxable <= 1200000) {
    rebate = Math.min(tax, 60000);
    tax = 0;
  }
  const cess = tax * 0.04;
  return { stdDed, taxable, taxBeforeCess: tax, rebate, cess, total: tax + cess };
}

export function computeOldRegime(gross, salaried, age, deductions80c, deductions80d, deductions80ccd, otherDed) {
  const stdDed = salaried ? 50000 : 0;
  const cappedC = Math.min(deductions80c || 0, 150000);
  const cappedD = Math.min(deductions80d || 0, 25000);
  const cappedCcd = Math.min(deductions80ccd || 0, 50000);
  const taxable = Math.max(0, gross - stdDed - cappedC - cappedCcd - cappedD - (otherDed || 0));
  let tax = calcSlabTax(taxable, oldSlabsFor(age));
  let rebate = 0;
  if (taxable <= 500000) {
    rebate = Math.min(tax, 12500);
    tax = 0;
  }
  const cess = tax * 0.04;
  return { stdDed, cappedC, cappedD, cappedCcd, taxable, taxBeforeCess: tax, rebate, cess, total: tax + cess };
}

// ---------- API ----------
const API = import.meta.env.VITE_API_URL || "";
export const TOKEN_KEY = "bahi_token";

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
