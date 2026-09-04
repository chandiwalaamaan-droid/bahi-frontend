import React, { useState } from "react";
import { apiPut } from "../utils";

export default function BusinessProfile({ profile, setProfile, setError }) {
  const [form, setForm] = useState(profile);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const saved = await apiPut("/business-profile", form);
      setProfile(saved);
      setForm(saved);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.message || "Could not save your business profile — please check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="pagehead">
        <h1>Business Profile</h1>
        <p>Shown on invoices you generate. Kept private to your account.</p>
      </div>
      <form className="card" onSubmit={save}>
        <div className="grid2">
          <div className="field">
            <label>Business / trade name</label>
            <input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>GSTIN (optional)</label>
            <input
              value={form.gstin}
              onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
              placeholder="15-character GSTIN"
              style={{ width: "100%" }}
            />
          </div>
          <div className="field">
            <label>PAN (optional)</label>
            <input
              value={form.pan}
              onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
              placeholder="ABCDE1234F"
              style={{ width: "100%" }}
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Business email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%" }} />
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ width: "100%" }} />
        </div>
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
        {savedAt && <span style={{ marginLeft: 12, fontSize: 12.5, color: "var(--slate)" }}>Saved.</span>}
      </form>
    </div>
  );
}
