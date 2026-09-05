import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete, fmtR, uid, todayISO } from "../utils";

function blankItem() {
  return { id: uid(), desc: "", qty: 1, rate: "", gst: 18 };
}

export default function RecurringInvoices({ setError }) {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [genBusyId, setGenBusyId] = useState(null);
  const [form, setForm] = useState({
    client: "", clientGstin: "", clientAddress: "",
    frequency: "monthly", startDate: todayISO(), endDate: "",
    paymentTerms: 14, items: [blankItem()],
  });

  const loadTemplates = async () => {
    try {
      const data = await apiGet("/recurring");
      setTemplates(data);
    } catch (e) {
      setError(e.message || "Could not load recurring invoices.");
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const subtotal = form.items.reduce((s, it) => s + (parseFloat(it.rate) || 0) * (parseFloat(it.qty) || 0), 0);
  const gstTotal = form.items.reduce((s, it) => s + ((parseFloat(it.rate) || 0) * (parseFloat(it.qty) || 0) * (parseFloat(it.gst) || 0)) / 100, 0);
  const grand = subtotal + gstTotal;

  const updateItem = (id, patch) => setForm({ ...form, items: form.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
  const addItem = () => setForm({ ...form, items: [...form.items, blankItem()] });
  const removeItem = (id) => setForm({ ...form, items: form.items.filter((it) => it.id !== id) });

  const resetForm = () => {
    setForm({
      client: "", clientGstin: "", clientAddress: "",
      frequency: "monthly", startDate: todayISO(), endDate: "",
      paymentTerms: 14, items: [blankItem()],
    });
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (tpl) => {
    setEditingId(tpl.id);
    setShowForm(true);
    setForm({
      client: tpl.client, clientGstin: tpl.clientGstin, clientAddress: tpl.clientAddress,
      frequency: tpl.frequency, startDate: tpl.startDate, endDate: tpl.endDate,
      paymentTerms: tpl.paymentTerms,
      items: tpl.items.map((it) => ({ ...it, id: it.id || uid() })),
    });
  };

  const save = async () => {
    if (!form.client || form.items.every((it) => !it.desc)) return;
    setBusy(true);
    setError("");
    try {
      const payload = {
        id: editingId || uid(),
        client: form.client, clientGstin: form.clientGstin, clientAddress: form.clientAddress,
        frequency: form.frequency, startDate: form.startDate, endDate: form.endDate,
        paymentTerms: form.paymentTerms, items: form.items,
      };
      if (editingId) {
        const saved = await apiPut(`/recurring/${editingId}`, payload);
        setTemplates((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      } else {
        const saved = await apiPost("/recurring", payload);
        setTemplates((prev) => [saved, ...prev]);
      }
      resetForm();
    } catch (e) {
      setError(e.message || "Could not save recurring invoice.");
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (tpl) => {
    const next = tpl.status === "active" ? "paused" : "active";
    try {
      const saved = await apiPut(`/recurring/${tpl.id}`, { status: next });
      setTemplates((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    } catch (e) {
      setError(e.message || "Could not update status.");
    }
  };

  const generate = async (id) => {
    setGenBusyId(id);
    setError("");
    try {
      await apiPost(`/recurring/${id}/generate`, {});
      await loadTemplates();
    } catch (e) {
      setError(e.message || "Could not generate invoice.");
    } finally {
      setGenBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this recurring template?")) return;
    try {
      await apiDelete(`/recurring/${id}`);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e.message || "Could not delete.");
    }
  };

  return (
    <div>
      <div className="pagehead" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1>Recurring Invoices</h1>
          <p>Templates that automatically generate invoices on a schedule — monthly, quarterly, or yearly.</p>
        </div>
        <button className="btn ghost sm" onClick={() => setShowForm(!showForm)} style={{ marginBottom: 16 }}>
          {showForm ? "Cancel" : "+ New template"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="grid2">
            <div className="field">
              <label>Client name</label>
              <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>Client GSTIN (optional)</label>
              <input value={form.clientGstin} onChange={(e) => setForm({ ...form, clientGstin: e.target.value.toUpperCase() })} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} style={{ width: "100%" }}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="field">
              <label>Start date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>End date (optional, blank = forever)</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>Payment terms (days)</label>
              <input type="number" min={0} max={365} value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: parseInt(e.target.value) || 14 })} style={{ width: "100%" }} />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Client address (optional)</label>
              <input value={form.clientAddress} onChange={(e) => setForm({ ...form, clientAddress: e.target.value })} style={{ width: "100%" }} />
            </div>
          </div>
          <hr className="hr" />
          <label>Line items</label>
          {form.items.map((it) => (
            <div className="invoice-item-row" key={it.id}>
              <input placeholder="Description" value={it.desc} onChange={(e) => updateItem(it.id, { desc: e.target.value })} />
              <input placeholder="Qty" type="number" value={it.qty} onChange={(e) => updateItem(it.id, { qty: e.target.value })} />
              <input placeholder="Rate ₹" type="number" value={it.rate} onChange={(e) => updateItem(it.id, { rate: e.target.value })} />
              <select value={it.gst} onChange={(e) => updateItem(it.id, { gst: e.target.value })}>
                {[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}% GST</option>)}
              </select>
              <button className="del" onClick={() => removeItem(it.id)}>✕</button>
            </div>
          ))}
          <button className="btn ghost sm" onClick={addItem}>+ Add line</button>
          <hr className="hr" />
          <div className="tax-line"><span>Subtotal</span><b>{fmtR(subtotal)}</b></div>
          <div className="tax-line"><span>GST</span><b>{fmtR(gstTotal)}</b></div>
          <div className="tax-total"><span>Total</span><span>{fmtR(grand)}</span></div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn" onClick={save} disabled={busy}>{busy ? "Saving…" : (editingId ? "Update template" : "Save template")}</button>
            <button className="btn ghost" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 14, fontSize: 16 }}>Saved templates</h3>
        {templates.length === 0 ? (
          <p className="empty">No recurring templates yet. Set one up to auto-generate invoices on a schedule.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Client</th><th>Frequency</th><th>Next date</th><th>Due</th><th>Status</th><th className="num">Total</th><th></th></tr>
              </thead>
              <tbody>
                {templates.map((tpl) => (
                  <tr key={tpl.id}>
                    <td>{tpl.client}</td>
                    <td>{tpl.frequency}</td>
                    <td>{tpl.nextDate || "—"}</td>
                    <td>{addDaysStr(tpl.nextDate, tpl.paymentTerms)}</td>
                    <td>
                      <button
                        className={`pill ${tpl.status === "active" ? "green" : "neutral"}`}
                        style={{
                          cursor: "pointer", background: "transparent", font: "inherit", fontSize: 11.5,
                        }}
                        onClick={() => toggleStatus(tpl)}
                        title={tpl.status === "active" ? "Pause" : "Activate"}
                      >
                        {tpl.status === "active" ? "Active" : "Paused"}
                      </button>
                    </td>
                    <td className="num">{fmtR(tpl.grand)}</td>
                    <td>
                      <div className="confirm-inline">
                        <button className="del" onClick={() => generate(tpl.id)} disabled={genBusyId === tpl.id} title="Generate now">
                          {genBusyId === tpl.id ? "…" : "Generate"}
                        </button>
                        <button className="del" onClick={() => startEdit(tpl)}>Edit</button>
                        <button className="del" onClick={() => remove(tpl.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function addDaysStr(dateStr, days) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + (days || 14));
  return d.toISOString().slice(0, 10);
}
