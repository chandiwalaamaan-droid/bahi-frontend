import React, { useState } from "react";
import { apiPost, apiPut, apiDelete, fmtR, uid, todayISO, downloadCSV } from "../utils";
import { CATEGORIES } from "../constants";

export default function Transactions({ txns, setTxns, setError }) {
  const [form, setForm] = useState({ date: todayISO(), type: "expense", category: CATEGORIES.expense[0], amount: "", note: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [quickText, setQuickText] = useState("");
  const [quickBusy, setQuickBusy] = useState(false);

  const quickAdd = async () => {
    const text = quickText.trim();
    if (!text) return;
    setQuickBusy(true);
    setError("");
    try {
      const parsed = await apiPost("/transactions/parse", { text });
      setForm({ date: todayISO(), type: parsed.type, category: parsed.category, amount: String(parsed.amount), note: parsed.note });
      setQuickText("");
    } catch (e) {
      setError(e.message || "Could not understand that entry — try phrasing it differently, or fill in the form below.");
    } finally {
      setQuickBusy(false);
    }
  };

  const add = async () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return;
    const entry = { id: uid(), ...form, amount: amt };
    setBusy(true);
    setError("");
    try {
      const saved = await apiPost("/transactions", entry);
      setTxns((prev) => [saved, ...prev]);
      setForm({ ...form, amount: "", note: "" });
    } catch (e) {
      setError(e.message || "Could not save that transaction — please try again.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (t) => {
    setConfirmingId(null);
    setEditingId(t.id);
    setEditForm({ date: t.date, type: t.type, category: t.category, amount: String(t.amount), note: t.note || "" });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm(null); };
  const saveEdit = async (id) => {
    const amt = parseFloat(editForm.amount);
    if (!amt || amt <= 0) return;
    setError("");
    try {
      const saved = await apiPut(`/transactions/${id}`, { ...editForm, amount: amt });
      setTxns((prev) => prev.map((t) => (t.id === id ? saved : t)));
      cancelEdit();
    } catch (e) {
      setError(e.message || "Could not update that transaction — please try again.");
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await apiDelete(`/transactions/${id}`);
      setTxns((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e.message || "Could not remove that transaction — please try again.");
    } finally {
      setConfirmingId(null);
    }
  };

  const sorted = [...txns].sort((a, b) => b.date.localeCompare(a.date));

  const exportCSV = () => {
    downloadCSV(
      `bahi-transactions-${todayISO()}.csv`,
      sorted,
      ["date", "type", "category", "amount", "note"]
    );
  };

  return (
    <div>
      <div className="pagehead" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1>Transactions</h1>
          <p>Log income and expenses to keep your books current.</p>
        </div>
        <button className="btn ghost sm" onClick={exportCSV} disabled={sorted.length === 0} style={{ marginBottom: 16 }}>
          Export CSV
        </button>
      </div>

      <div className="card">
        <label>Quick add — describe it in your own words</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && quickAdd()}
            placeholder='e.g. "paid 2500 for Canva subscription" or "received 40000 from Rahul"'
            style={{ flex: 1 }}
          />
          <button className="btn ghost" onClick={quickAdd} disabled={quickBusy}>
            {quickBusy ? "Reading…" : "Fill form"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 8, marginBottom: 0 }}>
          This fills the form below with the AI's best guess — review it, then save.
        </p>
      </div>

      <div className="card">
        <div className="grid2">
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value, category: CATEGORIES[e.target.value][0] })}
              style={{ width: "100%" }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: "100%" }}>
              {CATEGORIES[form.type].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Amount (₹)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={{ width: "100%" }} />
          </div>
        </div>
        <div className="field">
          <label>Note (optional)</label>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ width: "100%" }} />
        </div>
        <button className="btn" onClick={add} disabled={busy}>{busy ? "Saving…" : "Add entry"}</button>
      </div>

      <div className="card">
        {sorted.length === 0 ? (
          <p className="empty">Nothing logged yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Type</th><th>Category</th><th>Note</th><th className="num">Amount</th><th></th></tr>
              </thead>
              <tbody>
                {sorted.map((t) =>
                  editingId === t.id ? (
                    <tr key={t.id}>
                      <td><input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} /></td>
                      <td>
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value, category: CATEGORIES[e.target.value][0] })}
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </td>
                      <td>
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                          {CATEGORIES[editForm.type].map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td><input value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} /></td>
                      <td className="num"><input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} style={{ width: 100 }} /></td>
                      <td>
                        <div className="confirm-inline">
                          <button className="btn sm" onClick={() => saveEdit(t.id)}>Save</button>
                          <button className="del" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td><span className="pill">{t.type}</span></td>
                      <td>{t.category}</td>
                      <td>{t.note}</td>
                      <td className="num" style={{ color: t.type === "income" ? "var(--green)" : "var(--seal)" }}>
                        {fmtR(t.amount)}
                      </td>
                      <td>
                        {confirmingId === t.id ? (
                          <div className="confirm-inline">
                            <span style={{ fontSize: 12, color: "var(--slate)" }}>Remove?</span>
                            <button className="del" onClick={() => remove(t.id)}>Yes</button>
                            <button className="del" onClick={() => setConfirmingId(null)}>No</button>
                          </div>
                        ) : (
                          <div className="confirm-inline">
                            <button className="del" onClick={() => startEdit(t)}>Edit</button>
                            <button className="del" onClick={() => setConfirmingId(t.id)}>Remove</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
