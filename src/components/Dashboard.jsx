import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmtR, monthKey, monthLabel, todayISO, calcSlabTax, NEW_SLABS } from "../utils";
import { TAX_RULES } from "../taxRules";
import { Help } from "./Guide";

export default function Dashboard({ txns, invoices }) {
  const now = todayISO().slice(0, 7);
  const thisMonth = txns.filter((t) => monthKey(t.date) === now);
  const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  // Unpaid invoices, split into "outstanding" (not yet due) and "overdue"
  // (past their due date) — lumping these together made it impossible to
  // tell a healthy pipeline from one with actual collection problems.
  const unpaidInvoices = (invoices || []).filter((i) => i.status === "unpaid");
  const today = todayISO();
  const overdueInvoices = unpaidInvoices.filter((i) => i.dueDate && i.dueDate < today);
  const outstanding = unpaidInvoices.reduce((s, i) => s + Number(i.grand || 0), 0);
  const overdue = overdueInvoices.reduce((s, i) => s + Number(i.grand || 0), 0);

  // Estimated annual tax liability (new regime projection)
  const annualIncome = [...thisMonth.filter((t) => t.type === "income")]
    .reduce((s, t) => s + t.amount, 0) * (12 / (new Date().getMonth() + 1));
  const annualExpense = [...thisMonth.filter((t) => t.type === "expense")]
    .reduce((s, t) => s + t.amount, 0) * (12 / (new Date().getMonth() + 1));
  const netProfit = Math.max(0, annualIncome - annualExpense);
  // Rough estimate: 50% presumptive or slab on net profit, whichever is lower.
  // Intentionally NOT the same thing as a filed tax liability — see the
  // "Tax planning estimate" label and disclaimer below.
  const slabTax = calcSlabTax(annualIncome - annualExpense, NEW_SLABS) * 0.5; // simplified: apply slab to net, 50% presumptive
  const estTax = Math.min(slabTax, netProfit * 0.3);
  // Profit margin this month — how much of what came in is actually left
  // over, which tells a business owner something useful. The previous
  // "Monthly progress" metric was just (day-of-month / 30): it measured the
  // calendar, not the business, no matter what it was labeled.
  const profitMargin = income > 0 ? ((income - expense) / income) * 100 : null;

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
          <div className="lbl">
            Outstanding receivables
            <Help text="All unpaid invoices, whether or not their due date has passed yet." />
          </div>
          <div className="val">{fmtR(outstanding)}</div>
        </div>
        <div className="stat neg">
          <div className="lbl">
            Overdue
            <Help text="Unpaid invoices whose due date has already passed — these need chasing." />
          </div>
          <div className="val">{fmtR(overdue)}</div>
          {overdueInvoices.length > 0 && <div className="hint">{overdueInvoices.length} invoice{overdueInvoices.length === 1 ? "" : "s"}</div>}
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
            Tax planning estimate ({TAX_RULES.financialYear})
            <Help text="A rough, simplified projection based on this month's numbers scaled to a full year — not a real tax calculation. It doesn't account for deductions, other income, or exact filing rules. Use the Tax Calculator tab for a proper estimate, and confirm with a CA before filing." />
          </div>
          <div className="val">{fmtR(estTax)}</div>
          <div className="hint">Planning estimate, not a filing calculation</div>
        </div>
        <div className="stat">
          <div className="lbl">
            Profit margin this month
            <Help text="What share of this month's income is left after expenses — (income − expenses) ÷ income." />
          </div>
          <div className="val">{profitMargin === null ? "—" : `${Math.round(profitMargin)}%`}</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 14, fontSize: 16 }}>Income vs expenses, last 6 months</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--slate)" }} axisLine={{ stroke: "var(--rule)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--slate)" }} axisLine={{ stroke: "var(--rule)" }} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => fmtR(v)} contentStyle={{ fontSize: 13, border: "1px solid var(--rule)", background: "var(--card)", color: "var(--ink)", borderRadius: 10, boxShadow: "var(--shadow-md)" }} labelStyle={{ color: "var(--ink)" }} itemStyle={{ color: "var(--ink)" }} cursor={{ fill: "var(--primary)", opacity: 0.06 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--slate)" }} />
              <Bar dataKey="income" name="Income" fill="var(--green)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="var(--seal)" radius={[4, 4, 0, 0]} />
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

