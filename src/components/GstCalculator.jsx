import React, { useState } from "react";
import { fmtR } from "../utils";

export default function GstCalculator() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("exclusive");
  const [sameState, setSameState] = useState(true);

  let base, gstAmt, total;
  if (mode === "exclusive") {
    base = amount;
    gstAmt = (amount * rate) / 100;
    total = base + gstAmt;
  } else {
    total = amount;
    base = amount / (1 + rate / 100);
    gstAmt = total - base;
  }

  return (
    <div>
      <div className="pagehead">
        <h1>GST Calculator</h1>
        <p>Work out GST-inclusive or exclusive amounts, split by CGST/SGST or IGST.</p>
      </div>
      <div className="card">
        <div className="grid2">
          <div className="field">
            <label>Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>GST rate</label>
            <select value={rate} onChange={(e) => setRate(+e.target.value)} style={{ width: "100%" }}>
              {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
          <div className="field">
            <label>Amount is</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ width: "100%" }}>
              <option value="exclusive">Exclusive of GST (add GST)</option>
              <option value="inclusive">Inclusive of GST (extract GST)</option>
            </select>
          </div>
          <div className="field">
            <label>Transaction type</label>
            <select value={sameState ? "y" : "n"} onChange={(e) => setSameState(e.target.value === "y")} style={{ width: "100%" }}>
              <option value="y">Within same state (CGST + SGST)</option>
              <option value="n">Inter-state (IGST)</option>
            </select>
          </div>
        </div>
        <hr className="hr" />
        <div className="tax-line"><span>Taxable value</span><b>{fmtR(base)}</b></div>
        {sameState ? (
          <>
            <div className="tax-line"><span>CGST ({rate / 2}%)</span><b>{fmtR(gstAmt / 2)}</b></div>
            <div className="tax-line"><span>SGST ({rate / 2}%)</span><b>{fmtR(gstAmt / 2)}</b></div>
          </>
        ) : (
          <div className="tax-line"><span>IGST ({rate}%)</span><b>{fmtR(gstAmt)}</b></div>
        )}
        <div className="tax-total"><span>Total</span><span>{fmtR(total)}</span></div>
      </div>
    </div>
  );
}
