import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmtR, monthKey, monthLabel, todayISO, calcSlabTax, NEW_SLABS } from "../utils";
import { Help } from "./Guide";

export default function Dashboard({ txns, invoices }) {
  const now = todayISO().slice(0, 7);
  const thisMonth = txns.filter((t) => monthKey(t.date) === now);
  const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  // Outstanding invoices: sum of unpaid invoice grand totals
  const outstanding = (invoices || [])
    .filter((i) => i.status === "unpaid")
    .reduce((s, i) => s + Number(i.grand || 0), 0);

  // Estimated annual tax liability (new regime projection)
  const annualIncome = [...thisMonth.filter((t) => t.type === "income")]
    .reduce((s, t) => s + t.amount, 0) * (12 / (new Date().getMonth() + 1));
  const annualExpense = [...thisMonth.filter((t) => t.type === "expense")]
    .reduce((s, t) => s + t.amount, 0) * (12 / (new Date().getMonth() + 1));
  const netProfit = Math.max(0, annualIncome - annualExpense);
  // Rough estimate: 50% presumptive or slab on net profit, whichever is lower
  const slabTax = calcSlabTax(annualIncome - annualExpense, NEW_SLABS) * 0.5; // simplified: apply slab to net, 50% presumptive
  const estTax = Math.min(slabTax, netProfit * 0.3);
  const monthlyProgress = Math.min(100, ((new Date().getDate() / 30) * 100));

  const byMonth = {};
  txns.forEach((t) => {
    const k = monthKey(t.date);
    byMonth[k] = byMonth[k] || { month: k, income: 0, expense: 0 };
    byMonth[k][t.type] += t.amount;
  });
  const chartData = Object.values(byMonth)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((d) => ({ ...d, label: monthLabel(d.month) }));

  const recent = [...txns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <div>
      <div className="pagehead">
        <h1>Business Health</h1>
        <p>Key metrics for your practice this month.</p>
      </div>
      <div className="row" style={{ marginBottom: 28 }}>
        <div className="stat pos">
          <div className="lbl">Income this month</div>
          <div className="val">{fmtR(income)}</div>
        </div>
        <div className="stat neg">
          <div className="lbl">Expenses this month</div>
          <div className="val">{fmtR(expense)}</div>
        </div>
        <div className="stat">
          <div className="lbl">Net cash flow</div>
          <div className="val" style={{ color: income - expense >= 0 ? "var(--green)" : "var(--seal)" }}>
            {fmtR(income - expense)}
          </div>
        </div>
        <div className="stat warn">
          <div className="lbl">Outstanding receivables</div>
          <div className="val">{fmtR(outstanding)}</div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 28 }}>
        <div className="stat">
          <div className="lbl">Projected annual income</div>
          <div className="val">{fmtR(annualIncome)}</div>
        </div>
        <div className="stat neg">
          <div className="lbl">Projected annual expenses</div>
          <div className="val">{fmtR(annualExpense)}</div>
        </div>
        <div className="stat warn">
          <div className="lbl">
            Est. tax liability (FY 2025–26)
            <Help text="A rough, simplified projection based on this month's numbers scaled to a full year — not a real tax calculation. It doesn't account for deductions, other income, or exact filing rules. Use the Tax Calculator tab for a proper estimate, and confirm with a CA before filing." />
          </div>
          <div className="val">{fmtR(estTax)}</div>
          <div className="hint">Rough estimate, not tax advice</div>
        </div>
        <div className="stat">
          <div className="lbl">Monthly progress</div>
          <div className="val">{Math.round(monthlyProgress)}%</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 14, fontSize: 16 }}>Income vs expenses, last 6 months</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#D8D3C7" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5B6470" }} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5B6470" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => fmtR(v)} contentStyle={{ fontSize: 13, border: "1px solid #D8D3C7" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="#2F5233" />
              <Bar dataKey="expense" name="Expense" fill="#7A2331" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 14, fontSize: 16 }}>Recent entries</h3>
        {recent.length === 0 ? (
          <p className="empty">No transactions yet — add your first one in the Transactions tab.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Date</th><th>Category</th><th>Note</th><th className="num">Amount</th></tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.note}</td>
                  <td className="num" style={{ color: t.type === "income" ? "var(--green)" : "var(--seal)" }}>
                    {t.type === "income" ? "+" : "−"}{fmtR(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

