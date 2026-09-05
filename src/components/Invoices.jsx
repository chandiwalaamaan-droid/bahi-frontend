import React, { useState, useEffect } from "react";
import { apiPost, apiPut, apiDelete, apiGet, apiPatch, fmtR, uid, todayISO } from "../utils";
import RecurringInvoices from "./RecurringInvoices";

function blankItem() {
  return { id: uid(), desc: "", qty: 1, rate: "", gst: 18 };
}

export default function Invoices({ invoices, setInvoices, setError, profile }) {
  const [client, setClient] = useState("");
  const [clientGstin, setClientGstin] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [date, setDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([blankItem()]);
  const [viewing, setViewing] = useState(null);
  const [notes, setNotes] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("unpaid");

  const [noteForm, setNoteForm] = useState({ type: "credit", date: todayISO(), amount: "", reason: "" });
  const [noteBusy, setNoteBusy] = useState(false);

  const updateItem = (id, patch) => setItems(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const addItem = () => setItems([...items, blankItem()]);
  const removeItem = (id) => setItems(items.filter((it) => it.id !== id));

  const resetForm = () => {
    setClient("");
    setClientGstin("");
    setClientAddress("");
    setDate(todayISO());
    setDueDate("");
    setItems([blankItem()]);
    setEditingInvoiceId(null);
    setEditingStatus("unpaid");
  };

  const startEditInvoice = (inv) => {
    setViewing(null);
    setEditingInvoiceId(inv.id);
    setClient(inv.client);
    setClientGstin(inv.clientGstin || "");
    setClientAddress(inv.clientAddress || "");
    setDate(inv.date);
    setDueDate(inv.dueDate || "");
    setEditingStatus(inv.status || "unpaid");
    setItems(inv.items.map((it) => ({ ...it, id: it.id || uid() })));
  };

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.rate) || 0) * (parseFloat(it.qty) || 0), 0);
  const gstTotal = items.reduce((s, it) => s + ((parseFloat(it.rate) || 0) * (parseFloat(it.qty) || 0) * (parseFloat(it.gst) || 0)) / 100, 0);
  const grand = subtotal + gstTotal;

  // Adjusted total: subtract credit notes, add debit notes.
  // Uses the viewed invoice's own saved total (viewing.grand), not the create/edit
  // form's `grand` above — those are unrelated when just viewing an invoice.
  const creditTotal = notes.filter((n) => n.type === "credit").reduce((s, n) => s + n.amount, 0);
  const debitTotal = notes.filter((n) => n.type === "debit").reduce((s, n) => s + n.amount, 0);
  const adjustedTotal = (viewing ? viewing.grand : grand) - creditTotal + debitTotal;

  const save = async () => {
    if (!client || items.every((it) => !it.desc)) return;
    setBusy(true);
    setError("");
    try {
      if (editingInvoiceId) {
        const inv = { client, clientGstin, clientAddress, date, dueDate, status: editingStatus, items, subtotal, gstTotal, grand };
        const saved = await apiPut(`/invoices/${editingInvoiceId}`, inv);
        setInvoices((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
      } else {
        const inv = { id: uid(), client, clientGstin, clientAddress, date, dueDate, status: "unpaid", items, subtotal, gstTotal, grand };
        const saved = await apiPost("/invoices", inv);
        setInvoices((prev) => [saved, ...prev]);
      }
      resetForm();
    } catch (e) {
      setError(e.message || "Could not save that invoice — please try again.");
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (inv) => {
    const next = inv.status === "paid" ? "unpaid" : "paid";
    setError("");
    try {
      await apiPatch(`/invoices/${inv.id}/status`, { status: next });
      setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, status: next } : i)));
      if (viewing && viewing.id === inv.id) setViewing({ ...viewing, status: next });
    } catch (e) {
      setError(e.message || "Could not update invoice status — please try again.");
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await apiDelete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (e) {
      setError(e.message || "Could not remove that invoice — please try again.");
    } finally {
      setConfirmingId(null);
    }
  };

  const loadNotes = async (invoiceId) => {
    try {
      const data = await apiGet(`/invoice-notes?invoice_id=${invoiceId}`);
      setNotes(data);
    } catch (e) {
      setError(e.message || "Could not load credit/debit notes.");
      setNotes([]);
    }
  };

  const saveNote = async () => {
    const amt = parseFloat(noteForm.amount);
    if (!amt || amt <= 0) return;
    setNoteBusy(true);
    setError("");
    try {
      const saved = await apiPost("/invoice-notes", {
        id: uid(),
        invoiceId: viewing.id,
        type: noteForm.type,
        date: noteForm.date,
        amount: amt,
        reason: noteForm.reason,
      });
      setNotes((prev) => [saved, ...prev]);
      setNoteForm({ type: "credit", date: todayISO(), amount: "", reason: "" });
    } catch (e) {
      setError(e.message || "Could not save note — please try again.");
    } finally {
      setNoteBusy(false);
    }
  };

  const deleteNote = async (id) => {
    setError("");
    try {
      await apiDelete(`/invoice-notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setError(e.message || "Could not delete note — please try again.");
    }
  };

  const viewInvoice = (inv) => {
    setViewing(inv);
    setNotes([]);
    loadNotes(inv.id);
  };

  const closeView = () => {
    setViewing(null);
    setNotes([]);
  };

  if (viewing) {
    return (
      <div>
        <button className="btn ghost sm" style={{ marginBottom: 18 }} onClick={closeView}>← Back to invoices</button>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              {profile?.business_name && <div style={{ fontWeight: 600, marginBottom: 2 }}>{profile.business_name}</div>}
              {profile?.gstin && <div style={{ fontSize: 12.5, color: "var(--slate)" }}>GSTIN: {profile.gstin}</div>}
              {profile?.pan && <div style={{ fontSize: 12.5, color: "var(--slate)" }}>PAN: {profile.pan}</div>}
              {profile?.address && <div style={{ fontSize: 12.5, color: "var(--slate)", whiteSpace: "pre-line" }}>{profile.address}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <h2>{viewing.number}</h2>
              <span className={`pill ${viewing.status === "paid" ? "green" : "seal"}`}>
                {viewing.status === "paid" ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>
          <hr className="hr" />
          <div className="grid2" style={{ marginBottom: 6 }}>
            <div>
              <p style={{ color: "var(--slate)", fontSize: 13, marginTop: 4 }}>Billed to: <strong>{viewing.client}</strong></p>
              {viewing.clientGstin && <p style={{ color: "var(--slate)", fontSize: 12.5 }}>GSTIN: {viewing.clientGstin}</p>}
              {viewing.clientAddress && <p style={{ color: "var(--slate)", fontSize: 12.5, whiteSpace: "pre-line" }}>{viewing.clientAddress}</p>}
            </div>
            <div style={{ textAlign: "right", color: "var(--slate)", fontSize: 13 }}>
              <div>Invoice date: {viewing.date}</div>
              {viewing.dueDate && <div>Due: {viewing.dueDate}</div>}
            </div>
          </div>
          <table>
            <thead><tr><th>Description</th><th className="num">Qty</th><th className="num">Rate</th><th className="num">GST%</th><th className="num">Amount</th></tr></thead>
            <tbody>
              {viewing.items.map((it) => (
                <tr key={it.id}>
                  <td>{it.desc}</td>
                  <td className="num">{it.qty}</td>
                  <td className="num">{fmtR(it.rate)}</td>
                  <td className="num">{it.gst}%</td>
                  <td className="num">{fmtR((it.rate || 0) * (it.qty || 0) * (1 + (it.gst || 0) / 100))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="hr" />
          <div className="tax-line"><span>Subtotal</span><b>{fmtR(viewing.subtotal)}</b></div>
          <div className="tax-line"><span>GST</span><b>{fmtR(viewing.gstTotal)}</b></div>
          {creditTotal > 0 && (
            <div className="tax-line"><span>Credit notes</span><b style={{ color: "var(--green)" }}>−{fmtR(creditTotal)}</b></div>
          )}
          {debitTotal > 0 && (
            <div className="tax-line"><span>Debit notes</span><b style={{ color: "var(--seal)" }}>+{fmtR(debitTotal)}</b></div>
          )}
          <div className="tax-total"><span>Total due</span><span>{fmtR(adjustedTotal)}</span></div>

          {/* Credit / Debit notes section */}
          {notes.length > 0 && (
            <>
              <hr className="hr" />
              <h4 style={{ fontSize: 14, marginBottom: 10 }}>Credit / Debit Notes</h4>
              <table>
                <thead>
                  <tr><th>Number</th><th>Type</th><th>Date</th><th className="num">Amount</th><th>Reason</th><th></th></tr>
                </thead>
                <tbody>
                  {notes.map((n) => (
                    <tr key={n.id} className="note-row">
                      <td>{n.number}</td>
                      <td><span className={`pill ${n.type === "credit" ? "green" : "seal"}`}>{n.type === "credit" ? "Credit" : "Debit"}</span></td>
                      <td>{n.date}</td>
                      <td className="num">{fmtR(n.amount)}</td>
                      <td>{n.reason}</td>
                      <td>
                        <button className="del" style={{ fontSize: 11 }} onClick={() => deleteNote(n.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Add note form */}
          <hr className="hr" />
          <h4 style={{ fontSize: 14, marginBottom: 10 }}>Add credit / debit note</h4>
          <div className="grid2">
            <div className="field">
              <label>Type</label>
              <select value={noteForm.type} onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })} style={{ width: "100%" }}>
                <option value="credit">Credit note (reduce amount owed)</option>
                <option value="debit">Debit note (increase amount owed)</option>
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" value={noteForm.date} onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>Amount (₹)</label>
              <input type="number" value={noteForm.amount} onChange={(e) => setNoteForm({ ...noteForm, amount: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>Reason</label>
              <input value={noteForm.reason} onChange={(e) => setNoteForm({ ...noteForm, reason: e.target.value })} style={{ width: "100%" }} placeholder="e.g. Goods returned, price adjustment" />
            </div>
          </div>
          <button className="btn" style={{ marginTop: 8 }} onClick={saveNote} disabled={noteBusy}>
            {noteBusy ? "Saving…" : "Save note"}
          </button>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => window.print()}>Print / save as PDF</button>
            <button className="btn ghost" onClick={() => toggleStatus(viewing)}>
              Mark as {viewing.status === "paid" ? "unpaid" : "paid"}
            </button>
            <button className="btn ghost" onClick={() => startEditInvoice(viewing)}>Edit invoice</button>
            <button className="btn ghost" onClick={() => { if (window.confirm("Delete this invoice? This cannot be undone.")) remove(viewing.id); }}>Delete invoice</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pagehead">
        <h1>Invoices</h1>
        <p>Create GST-ready invoices and credit/debit notes for clients.</p>
      </div>
      <div className="card">
        {editingInvoiceId && (
          <p style={{ fontSize: 13, color: "var(--seal)", marginTop: 0, marginBottom: 14 }}>
            Editing invoice — saving will update it instead of creating a new one.
          </p>
        )}
        <div className="grid2">
          <div className="field">
            <label>Client name</label>
            <input value={client} onChange={(e) => setClient(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Client GSTIN (optional)</label>
            <input value={clientGstin} onChange={(e) => setClientGstin(e.target.value.toUpperCase())} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Invoice date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Due date (optional)</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>
        <div className="field">
          <label>Client address (optional)</label>
          <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} style={{ width: "100%" }} />
        </div>
        <hr className="hr" />
        <label>Line items</label>
        {items.map((it) => (
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
        <button className="btn" style={{ marginTop: 16 }} onClick={save} disabled={busy}>
          {busy ? "Saving…" : editingInvoiceId ? "Update invoice" : "Save invoice"}
        </button>
        {editingInvoiceId && (
          <button className="btn ghost" style={{ marginTop: 16, marginLeft: 10 }} onClick={resetForm}>Cancel edit</button>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 14, fontSize: 16 }}>Saved invoices</h3>
        {invoices.length === 0 ? (
          <p className="empty">No invoices saved yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Number</th><th>Client</th><th>Date</th><th>Due</th><th>Status</th><th className="num">Total</th><th></th></tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.number}</td>
                    <td>{inv.client}</td>
                    <td>{inv.date}</td>
                    <td>{inv.dueDate || "—"}</td>
                    <td>
                      <button
                        className={`pill ${inv.status === "paid" ? "green" : "seal"}`}
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          font: "inherit",
                          fontSize: 11.5,
                        }}
                        onClick={() => toggleStatus(inv)}
                        title="Click to toggle paid/unpaid"
                      >
                        {inv.status === "paid" ? "Paid" : "Unpaid"}
                      </button>
                    </td>
                    <td className="num">{fmtR(inv.grand)}</td>
                    <td>
                      {confirmingId === inv.id ? (
                        <div className="confirm-inline">
                          <span style={{ fontSize: 12, color: "var(--slate)" }}>Delete?</span>
                          <button className="del" onClick={() => remove(inv.id)}>Yes</button>
                          <button className="del" onClick={() => setConfirmingId(null)}>No</button>
                        </div>
                      ) : (
                        <div className="confirm-inline">
                          <button className="del" onClick={() => viewInvoice(inv)}>View</button>
                          <button className="del" onClick={() => startEditInvoice(inv)}>Edit</button>
                          <button className="del" onClick={() => setConfirmingId(inv.id)}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RecurringInvoices setError={setError} />
    </div>
  );
}
