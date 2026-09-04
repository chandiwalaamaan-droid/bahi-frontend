import React, { useState } from "react";
import { fmtR, computeNewRegime, computeOldRegime } from "../utils";

export default function TaxCalculator() {
  const [gross, setGross] = useState(1200000);
  const [salaried, setSalaried] = useState(true);
  const [age, setAge] = useState("below60");
  const [c80c, setC80c] = useState(150000);
  const [c80d, setC80d] = useState(25000);
  const [c80ccd, setC80ccd] = useState(0);
  const [otherDed, setOtherDed] = useState(0);

  const nr = computeNewRegime(gross, salaried);
  const or_ = computeOldRegime(gross, salaried, age, c80c, c80d, c80ccd, otherDed);
  const newWins = nr.total <= or_.total;

  return (
    <div>
      <div className="pagehead">
        <h1>Tax Calculator</h1>
        <p>Old vs new regime, FY 2025–26 (AY 2026–27) slab rates.</p>
      </div>
      <div className="card">
        <div className="grid2">
          <div className="field">
            <label>Gross annual income (₹)</label>
            <input type="number" value={gross} onChange={(e) => setGross(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Employment type</label>
            <select value={salaried ? "y" : "n"} onChange={(e) => setSalaried(e.target.value === "y")} style={{ width: "100%" }}>
              <option value="y">Salaried / pensioner (gets standard deduction)</option>
              <option value="n">Business / professional income</option>
            </select>
          </div>
          <div className="field">
            <label>Age category (affects old regime only)</label>
            <select value={age} onChange={(e) => setAge(e.target.value)} style={{ width: "100%" }}>
              <option value="below60">Below 60</option>
              <option value="senior">Senior citizen (60–80)</option>
              <option value="supersenior">Super senior (80+)</option>
            </select>
          </div>
          <div className="field">
            <label>Section 80C investments (max ₹1,50,000)</label>
            <input type="number" value={c80c} onChange={(e) => setC80c(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Section 80D — medical insurance (max ₹25,000 self, up to ₹50,000 if 60+)</label>
            <input type="number" value={c80d} onChange={(e) => setC80d(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Section 80CCD(1B) — NPS additional (max ₹50,000)</label>
            <input type="number" value={c80ccd} onChange={(e) => setC80ccd(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="field">
            <label>Other deductions — HRA, home loan interest, etc. (old regime)</label>
            <input type="number" value={otherDed} onChange={(e) => setOtherDed(+e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      <div className="tax-compare">
        <div className={`tax-col ${newWins ? "winner" : ""}`}>
          <h3>New regime {newWins && "— lower"}</h3>
          <div className="tax-line"><span>Standard deduction</span><b>{fmtR(nr.stdDed)}</b></div>
          <div className="tax-line"><span>Taxable income</span><b>{fmtR(nr.taxable)}</b></div>
          <div className="tax-line"><span>Tax before rebate</span><b>{fmtR(nr.taxBeforeCess + nr.rebate)}</b></div>
          <div className="tax-line"><span>87A rebate</span><b>−{fmtR(nr.rebate)}</b></div>
          <div className="tax-line"><span>Health &amp; education cess (4%)</span><b>{fmtR(nr.cess)}</b></div>
          <div className="tax-total"><span>Total tax</span><span>{fmtR(nr.total)}</span></div>
        </div>
        <div className={`tax-col ${!newWins ? "winner" : ""}`}>
          <h3>Old regime {!newWins && "— lower"}</h3>
          <div className="tax-line"><span>Standard deduction</span><b>{fmtR(or_.stdDed)}</b></div>
          <div className="tax-line"><span>80C (capped at ₹1.5L)</span><b>{fmtR(or_.cappedC)}</b></div>
          <div className="tax-line"><span>80CCD(1B) (capped at ₹50K)</span><b>{fmtR(or_.cappedCcd)}</b></div>
          <div className="tax-line"><span>80D (capped at ₹25K)</span><b>{fmtR(or_.cappedD)}</b></div>
          <div className="tax-line"><span>Other deductions</span><b>{fmtR(otherDed || 0)}</b></div>
          <div className="tax-line"><span>Taxable income</span><b>{fmtR(or_.taxable)}</b></div>
          <div className="tax-line"><span>Tax before rebate</span><b>{fmtR(or_.taxBeforeCess + or_.rebate)}</b></div>
          <div className="tax-line"><span>87A rebate</span><b>−{fmtR(or_.rebate)}</b></div>
          <div className="tax-line"><span>Health &amp; education cess (4%)</span><b>{fmtR(or_.cess)}</b></div>
          <div className="tax-total"><span>Total tax</span><span>{fmtR(or_.total)}</span></div>
        </div>
      </div>
      <div className="disclaimer">
        This is an estimate for general planning only — it doesn't account for surcharge on very high incomes, marginal relief,
        capital gains, or every deduction. It isn't a substitute for advice from a licensed CA or the official income tax
        e-filing calculator, especially before filing.
      </div>
    </div>
  );
}
