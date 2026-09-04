import React, { useEffect } from "react";

// Optional — set VITE_SUPPORT_EMAIL in your .env (same pattern as
// VITE_GOOGLE_CLIENT_ID) if you want a contact address shown here.
// Leave it unset and the app just skips the "Contact" line — nothing breaks.
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

const FAQS = [
  {
    q: "Is Bahi free to use?",
    a: "Yes. There's no paid plan, subscription, or usage limit — every feature (Transactions, Invoices, calculators, Business Profile) is free.",
  },
  {
    q: "Is the AI Advisor a real chartered accountant?",
    a: "No. It's an AI assistant that can help explain GST and income tax concepts and look at your own numbers, but it isn't a licensed CA and can make mistakes. Confirm anything consequential — filings, large transactions, notices from the tax department — with a qualified CA before acting on it.",
  },
  {
    q: "How accurate is the \"Est. tax liability\" on the Dashboard?",
    a: "It's a rough, simplified projection — this month's income and expenses scaled to a full year, with a simplified tax calculation. It doesn't account for deductions, other income sources, or exact filing rules. Use the Tax Calculator tab for a more detailed old-vs-new regime comparison, and treat both as planning tools, not filing numbers.",
  },
  {
    q: "Can I get my data out if I want to hand it to a real CA?",
    a: "Yes — open Transactions and use \"Export CSV\" to download every logged entry as a spreadsheet file you can share or import elsewhere.",
  },
  {
    q: "Is my data private?",
    a: "Your transactions, invoices, and profile are stored under your account and are only visible to you when logged in. If you ask the AI Advisor about your own numbers, a snapshot of your recent transactions and invoices is sent to the configured AI provider to answer that question.",
  },
  {
    q: "Why does the AI Advisor sometimes say it's unavailable?",
    a: "It relies on an external AI provider. If none are configured on this server, or all of them are temporarily down, you'll see a message explaining which. Every other part of Bahi — Transactions, Invoices, calculators, Business Profile — works independently of the AI Advisor.",
  },
];

export default function Support({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="guide-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="support-title">
        <button className="guide-close" onClick={onClose} aria-label="Close support">×</button>
        <h2 id="support-title">FAQ &amp; Support</h2>
        <p className="guide-intro">
          Common questions about what Bahi can and can't do. For anything else, use the "Guide"
          button in the sidebar for a walkthrough of each section.
        </p>

        <div className="guide-glossary" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
          <dl>
            {FAQS.map((f) => (
              <div className="guide-term" key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {SUPPORT_EMAIL && (
          <p style={{ fontSize: 13, color: "var(--slate)" }}>
            Still stuck? Reach out at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--primary)" }}>{SUPPORT_EMAIL}</a>.
          </p>
        )}

        <div className="guide-footer">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
