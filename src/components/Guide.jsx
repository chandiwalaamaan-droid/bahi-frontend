import React, { useEffect } from "react";
import {
  IconDashboard,
  IconTransactions,
  IconInvoice,
  IconCalculator,
  IconPercent,
  IconAdvisor,
  IconBuilding,
} from "../Icons";

// Small "?" badge that shows a plain-language explanation on hover/focus/tap.
// Drop next to any field or label that uses a term a first-time user won't know.
export function Help({ text }) {
  return (
    <span className="help" tabIndex={0}>
      <button type="button" className="helpq" aria-label="What does this mean?">?</button>
      <span className="helptext">{text}</span>
    </span>
  );
}

const STEPS = [
  {
    icon: IconDashboard,
    title: "Dashboard",
    body: "A quick snapshot: what you've earned and spent this month, what clients still owe you, and a rough guess at the tax you'll owe this year.",
  },
  {
    icon: IconTransactions,
    title: "Transactions",
    body: "Log every rupee in or out — a client payment, rent, a software subscription. This is the raw diary everything else is built from.",
  },
  {
    icon: IconInvoice,
    title: "Invoices",
    body: "Create a bill to send a client, mark it paid once they pay you, and issue a credit or debit note if you need to correct one later.",
  },
  {
    icon: IconCalculator,
    title: "Tax Calculator",
    body: "Type in your yearly income and see, side by side, whether the old or new tax regime saves you more. No guesswork.",
  },
  {
    icon: IconPercent,
    title: "GST Calculator",
    body: "Add or remove GST from a price in one click — handy when you're quoting a client or checking an invoice.",
  },
  {
    icon: IconAdvisor,
    title: "AI Advisor",
    body: "Ask it anything about your books, GST, or income tax in plain English. It can see a snapshot of your own numbers when you ask about them.",
  },
  {
    icon: IconBuilding,
    title: "Business Profile",
    body: "Your business name, address, and tax IDs — filled in here once, then used automatically on every invoice you create.",
  },
];

const GLOSSARY = [
  {
    term: "GST",
    def: "Goods and Services Tax — a tax added to the price of most goods and services in India. If you charge it, you usually have to pass it on to the government.",
  },
  {
    term: "GSTIN",
    def: "Your business's 15-character GST registration number. You only have one if you're registered for GST — many small freelancers and students aren't, and that's fine, this field is optional.",
  },
  {
    term: "PAN",
    def: "Permanent Account Number — a 10-character ID every taxpayer in India has. It's issued once, for life, and used to track your income tax.",
  },
  {
    term: "Old vs new tax regime",
    def: "Two different ways to calculate your income tax. The new regime has lower rates but skips most deductions; the old regime has higher rates but lets you subtract things like insurance and investments first. The calculator shows which one costs you less.",
  },
  {
    term: "Section 80C / 80D / 80CCD",
    def: "Sections of the old regime that let you reduce your taxable income — 80C covers things like PPF and life insurance, 80D covers health insurance, 80CCD covers NPS retirement contributions.",
  },
  {
    term: "Credit / debit note",
    def: "A follow-up document to an invoice that fixes a mistake — a credit note reduces what's owed (e.g. a refund), a debit note increases it (e.g. you undercharged).",
  },
];

export default function Guide({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="guide-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">
        <button className="guide-close" onClick={onClose} aria-label="Close guide">×</button>
        <h2 id="guide-title">Welcome to Bahi 👋</h2>
        <p className="guide-intro">
          Bahi keeps your books in plain language — no accounting degree needed. Here's what each
          section does, and a few Indian tax terms explained simply. You can reopen this anytime
          from the "Guide" button in the sidebar.
        </p>

        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div className="guide-step" key={s.title}>
              <Icon className="navicon" />
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          );
        })}

        <div className="guide-glossary">
          <h3>Quick glossary</h3>
          <dl>
            {GLOSSARY.map((g) => (
              <div className="guide-term" key={g.term}>
                <dt>{g.term}</dt>
                <dd>{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="guide-footer">
          <button className="btn" onClick={onClose}>Got it, let's go</button>
        </div>
      </div>
    </div>
  );
}
