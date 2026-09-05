import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { apiGet, fmtR, fmt, todayISO, monthLabel } from "../utils";
import { Help } from "./Guide";

const PIE_COLORS = ["var(--primary)", "var(--green)", "var(--brass)", "var(--seal)", "var(--slate)"];

function dateDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function getPresets() {
  const today = todayISO();
  const now = new Date();
  const fyStartYr = now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear();
  const fyStart = `${fyStartYr}-04-01`;

  const d12 = new Date(); d12.setMonth(d12.getMonth() - 11); d12.setDate(1);
  const d6 = new Date(); d6.setMonth(d6.getMonth() - 5); d6.setDate(1);
  const d3 = new Date(); d3.setMonth(d3.getMonth() - 2); d3.setDate(1);
  const thisMonthStart = today.slice(0, 8) + "01";

  return [
    { label: "This FY", value: "fy", start: fyStart, end: today },
    { label: "Last 12 months", value: "12m", start: d12.toISOString().slice(0, 10), end: today },
    { label: "Last 6 months", value: "6m", start: d6.toISOString().slice(0, 10), end: today },
    { label: "Last 3 months", value: "3m", start: d3.toISOString().slice(0, 10), end: today },
    { label: "This month", value: "month", start: thisMonthStart, end: today },
  ];
}

const catToArr = (obj) => Object.entries(obj || {}).map(([k, v]) => ({ category: k, amount: Number(v) }));

export default function Reports({ txns, invoices }) {
  const [preset, setPreset] = useState("fy");
  const [start, setStart] = useState(getPresets().find((p) => p.value === "fy").start);
  const [end, setEnd] = useState(todayISO());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState("pnl");

  const [pnl, setPnl] = useState(null);
  const [cashflow, setCashflow] = useState(null);
  const [gstReport, setGstReport] = useState(null);
  const [trends, setTrends] = useState(null);

  const load = async () => {
    if (!start || !end) return;
    setLoading(true);
    setError("");
    try {
      const q = `start=${start}&end=${end}`;
      const [p, c, g, t] = await Promise.all([
        apiGet(`/reports/pnl?${q}`),
        apiGet(`/reports/cashflow?${q}`),
        apiGet(`/reports/gst?${q}`),
        apiGet("/reports/trends?months=12"),
      ]);
      setPnl(p);
      setCashflow(c);
      setGstReport(g);
      setTrends(t);
    } catch (e) {
      setError(e.message || "Could not load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  const onPreset = (p) => {
    setPreset(p.value);
    setStart(p.start);
    setEnd(p.end);
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="tax-line" style={{ fontSize: 12, padding: "6px 10px", background: "var(--paper)", borderRadius: 4, border: "1px solid var(--rule)" }}>
        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{label}</span>
        <div style={{ marginTop: 4 }}>
          {payload.map((p, i) => (
            <div key={i} style={{ fontSize: 11, color: p.color || "var(--slate)" }}>
              {p.name || p.dataKey}: <b>{fmtR(p.value)}</b>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loader"><div className="ring" /><p>Loading reports…</p></div>;

  return (
    <div>
      <div className="pagehead" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1>Reports &amp; Insights</h1>
          <p>Profit &amp; loss, cash flow, GST summary, and trend charts for your books.</p>
        </div>
          <div className="row" style={{ alignItems: "center", gap: 8 }}>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ width: 150 }} />
            <span style={{ color: "var(--slate)", fontSize: 13 }}>to</span>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ width: 150 }} />
          </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {getPresets().map((p) => (
          <button key={p.value} className={`btn ${preset === p.value ? "" : "ghost"} sm`} onClick={() => onPreset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      {error && <div className="banner-error">{error}</div>}

      {!start || !end ? null : (
        <div className="report-card">
          <div className="report-grid">
            <div
              className="report-stat"
              style={{ cursor: "pointer", border: activeReport === "pnl" ? "2px solid var(--primary)" : undefined }}
              onClick={() => setActiveReport("pnl")}
            >
              <div className="val">{fmtR(pnl?.netProfit || 0)}</div>
              <div className="lbl">Net Profit (P&amp;L)</div>
            </div>
            <div
              className="report-stat"
              style={{ cursor: "pointer", border: activeReport === "cashflow" ? "2px solid var(--primary)" : undefined }}
              onClick={() => setActiveReport("cashflow")}
            >
              <div className="val">{fmtR(cashflow?.netCashFlow || 0)}</div>
              <div className="lbl">Net Cash Flow</div>
            </div>
            <div
              className="report-stat"
              style={{ cursor: "pointer", border: activeReport === "gst" ? "2px solid var(--primary)" : undefined }}
              onClick={() => setActiveReport("gst")}
            >
              <div className="val">{fmtR(gstReport?.netGstPayable || 0)}</div>
              <div className="lbl">Net GST Payable</div>
            </div>
          </div>
        </div>
      )}

      {activeReport === "pnl" && (
        <div>
          {!pnl ? <p className="empty">No data for this period.</p> : (
            <div className="report-card">
              <h3>Profit &amp; Loss</h3>
              <div className="report-grid" style={{ marginBottom: 18 }}>
                <div className="report-stat"><div className="val">{fmtR(pnl.income?.total || 0)}</div><div className="lbl">Total Income</div></div>
                <div className="report-stat"><div className="val">{fmtR(pnl.expenses?.total || 0)}</div><div className="lbl">Total Expenses</div></div>
                <div className="report-stat"><div className="val" style={{ color: pnl.netProfit >= 0 ? "var(--green)" : "var(--seal)" }}>{fmtR(pnl.netProfit)}</div><div className="lbl">Net Profit</div></div>
              </div>
              <div className="grid2">
                <div>
                  <h4 style={{ fontSize: 14, marginBottom: 10 }}>Income by category</h4>
                  {pnl.income?.byCategory && Object.keys(pnl.income.byCategory).length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={catToArr(pnl.income.byCategory)} layout="vertical" margin={{ top: 5 }}>
                        <CartesianGrid stroke="var(--rule)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtR(v)} />
                        <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<BarTooltip />} formatter={(v) => [fmtR(v), ""]} />
                        <Bar dataKey="amount" fill="var(--green)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="empty">No income recorded.</p>}
                </div>
                <div>
                  <h4 style={{ fontSize: 14, marginBottom: 10 }}>Expenses by category</h4>
                  {pnl.expenses?.byCategory && Object.keys(pnl.expenses.byCategory).length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={catToArr(pnl.expenses.byCategory)} layout="vertical" margin={{ top: 5 }}>
                        <CartesianGrid stroke="var(--rule)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtR(v)} />
                        <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<BarTooltip />} formatter={(v) => [fmtR(v), ""]} />
                        <Bar dataKey="amount" fill="var(--seal)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="empty">No expenses recorded.</p>}
                </div>
              </div>
              {pnl.transactionCount > 0 && (
                <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 12 }}>
                  Based on {pnl.transactionCount} transactions from {pnl.period?.start} to {pnl.period?.end}.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {activeReport === "cashflow" && (
        <div className="report-card">
          <h3>Cash Flow</h3>
          {!cashflow || cashflow.byMonth?.length === 0 ? (
            <p className="empty">No transactions for this period.</p>
          ) : (
            <>
              <div className="report-grid" style={{ marginBottom: 18 }}>
                <div className="report-stat"><div className="val">{fmtR(cashflow.netCashFlow)}</div><div className="lbl">Net Cash Flow</div></div>
                <div className="report-stat"><div className="val" style={{ color: "var(--green)" }}>{fmtR(cashflow.byMonth.reduce((s, m) => s + m.income, 0))}</div><div className="lbl">Total In</div></div>
                <div className="report-stat"><div className="val" style={{ color: "var(--seal)" }}>{fmtR(cashflow.byMonth.reduce((s, m) => s + m.expense, 0))}</div><div className="lbl">Total Out</div></div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cashflow.byMonth} margin={{ top: 5 }}>
                  <CartesianGrid stroke="var(--rule)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip content={<BarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="income" name="Income" fill="var(--green)" />
                  <Bar dataKey="expense" name="Expenses" fill="var(--seal)" />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 12 }}>
                From {cashflow.byMonth.length} month{cashflow.byMonth.length !== 1 ? "s" : ""}.
              </p>
            </>
          )}
        </div>
      )}

      {activeReport === "gst" && (
        <div className="report-card">
          <h3>GST Summary</h3>
          {!gstReport || (gstReport.invoiceCount || 0) === 0 ? (
            <p className="empty">No invoices for this period.</p>
          ) : (
            <>
              <div className="report-grid" style={{ marginBottom: 18 }}>
                <div className="report-stat"><div className="val">{fmtR(gstReport.outputTax?.totalGst || 0)}</div><div className="lbl">Output Tax (collected)</div></div>
                <div className="report-stat"><div className="val">{fmtR(gstReport.inputTax || 0)}</div><div className="lbl">Input Tax (paid)</div></div>
                <div className="report-stat"><div className="val" style={{ color: gstReport.netGstPayable >= 0 ? "var(--seal)" : "var(--green)" }}>{fmtR(gstReport.netGstPayable)}</div><div className="lbl">Net GST Payable</div></div>
              </div>

              {gstReport.outputTax?.byRate && Object.keys(gstReport.outputTax.byRate).length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 10 }}>Output tax by rate</h4>
                  <table>
                    <thead><tr><th>GST Rate</th><th className="num">Taxable</th><th className="num">GST</th><th className="num">Invoice Total</th><th className="num">Invoices</th></tr></thead>
                    <tbody>
                      {Object.entries(gstReport.outputTax.byRate).sort((a, b) => Number(a[0]) - Number(b[0])).map(([rate, d]) => (
                        <tr key={rate}>
                          <td>{rate}%</td>
                          <td className="num">{fmtR(d.taxable)}</td>
                          <td className="num">{fmtR(d.gst)}</td>
                          <td className="num">{fmtR(d.total)}</td>
                          <td className="num">{d.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="tax-line"><span>Output tax</span><b>{fmtR(gstReport.outputTax?.totalGst || 0)}</b></div>
              <div className="tax-line"><span>Input tax</span><b>{fmtR(gstReport.inputTax || 0)}</b></div>
              <div className="tax-total"><span>Net GST payable</span><span>{fmtR(gstReport.netGstPayable)}</span></div>

              <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 12 }}>
                Input tax is derived from the optional GST field on your expense transactions. <Help text="When you log an expense that includes GST, enter the GST portion in the 'GST paid (₹)' field on the Transactions form. That amount is tracked as input tax, which reduces your net GST liability." />
              </p>
            </>
          )}
        </div>
      )}

      {activeReport === "trends" && (
        <div className="report-card">
          <h3>Trends</h3>
          {!trends || trends.months?.length === 0 ? (
            <p className="empty">No data for this period.</p>
          ) : (
            <>
              <div className="report-grid" style={{ marginBottom: 18 }}>
                <div className="report-stat"><div className="val">{fmtR(trends.months.reduce((s, m) => s + m.income, 0))}</div><div className="lbl">Total Income</div></div>
                <div className="report-stat"><div className="val">{fmtR(trends.months.reduce((s, m) => s + m.expense, 0))}</div><div className="lbl">Total Expenses</div></div>
                <div className="report-stat"><div className="val" style={{ color: trends.months.reduce((s, m) => s + m.income - m.expense, 0) >= 0 ? "var(--green)" : "var(--seal)" }}>{fmtR(trends.months.reduce((s, m) => s + m.net, 0))}</div><div className="lbl">Total Net</div></div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trends.months} margin={{ top: 5 }}>
                  <CartesianGrid stroke="var(--rule)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--slate)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip content={<BarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="income" name="Income" stroke="var(--green)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expense" name="Expenses" stroke="var(--seal)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="invoiceTotal" name="Invoiced" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>

              {trends.categoryBreakdown && (Object.keys(trends.categoryBreakdown.income).length > 0 || Object.keys(trends.categoryBreakdown.expense).length > 0) && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 10 }}>Spending by category — {monthLabel(trends.latestMonth)}</h4>
                  <PieChart width={400} height={220}>
                    <Pie
                      data={[
                        ...Object.entries(trends.categoryBreakdown.income).map(([cat, amt]) => ({ name: cat, value: Number(amt), type: "income" })),
                        ...Object.entries(trends.categoryBreakdown.expense).map(([cat, amt]) => ({ name: cat, value: Number(amt), type: "expense" })),
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {[
                        ...Object.entries(trends.categoryBreakdown.income).map(([cat, amt]) => ({ name: cat, value: Number(amt), type: "income" })),
                        ...Object.entries(trends.categoryBreakdown.expense).map(([cat, amt]) => ({ name: cat, value: Number(amt), type: "expense" })),
                      ].map((entry, i) => {
                        const fillColor = entry.type === "income" ? "var(--green)" : "var(--seal)";
                        return <Cell key={i} fill={fillColor} stroke="var(--card)" strokeWidth={2} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(v) => fmtR(v)} contentStyle={{ fontSize: 12, border: "1px solid var(--rule)", background: "var(--card)", color: "var(--ink)", borderRadius: 10, boxShadow: "var(--shadow-md)" }} labelStyle={{ color: "var(--ink)" }} itemStyle={{ color: "var(--ink)" }} />
                  </PieChart>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
