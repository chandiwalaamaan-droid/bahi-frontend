import React, { useEffect } from "react";

// Optional — set VITE_SUPPORT_EMAIL in your .env (same pattern as
// VITE_GOOGLE_CLIENT_ID) if you want a contact address shown here.
// Leave it unset and the app just skips the "Contact" line — nothing breaks.
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

const FAQS = [
  {
    q: "Is Bahi free to use?",
    a: "Yes. There's no paid plan, subscription, or usage limit — every feature (Transactions, Invoices, recurring invoices, Reports, calculators, Business Profile, dark mode, and offline app support) is free.",
  },
  {
    q: "Is the AI Advisor a real chartered accountant?",
    a: "No. It's an AI assistant that can help explain GST and income tax concepts and look at your own numbers, but it isn't a licensed CA and can make mistakes. Confirm anything consequential — filings, large transactions, notices from the tax department — with a qualified CA before acting on it.",
  },
  {
    q: "How do recurring invoices work?",
    a: "Set up a template in the Invoices tab with your client, line items, and a frequency (monthly, quarterly, or yearly). The app automatically generates a real invoice on each scheduled date, assigns it the next invoice number, and notifies you. You can pause, edit, or delete the template anytime.",
  },
  {
    q: "How do I get reminded about unpaid invoices?",
    a: "When an invoice's due date passes and it's still unpaid, Bahi creates an in-app notification for you. The bell icon in the sidebar turns red with the count. You can also enable browser notifications by installing the app as a PWA.",
  },
  {
    q: "What does the GST report show?",
    a: "It groups your invoices' GST by rate (e.g. 5%, 12%, 18%) to show output tax collected, subtracts any GST you recorded as input tax on expense entries, and shows your net GST payable. If you don't enter GST on expenses, only output tax is shown.",
  },
  {
    q: "How accurate is the \"Est. tax liability\" on the Dashboard?",
    a: "It's a rough, simplified projection — this month's income and expenses scaled to a full year, with a simplified tax calculation. It doesn't account for deductions, other income sources, or exact filing rules. Use the Tax Calculator tab for a more detailed old-vs-new regime comparison, and treat both as planning tools, not filing numbers.",
  },
  {
    q: "Can I get my data out if I want to hand it to a real CA?",
    a: "Yes — open Transactions and use \"Export CSV\" to download every logged entry as a spreadsheet file you can share or import elsewhere. You can also use the Reports tab to see P&L, cash flow, and GST summaries.",
  },
  {
    q: "Can I use Bahi offline or on my phone?",
    a: "Yes — Bahi is a Progressive Web App. On mobile, you'll see an \"Add to Home screen\" prompt; on desktop, install it from your browser. Once loaded, your data and the app interface work offline (you'll need a connection for the AI Advisor and live reports).",
  },
  {
    q: "Is my data private?",
    a: "Your transactions, invoices, and profile are stored under your account and are only visible to you when logged in. If you ask the AI Advisor about your own numbers, a snapshot of your recent transactions and invoices is sent to the configured AI provider to answer that question.",
  },
  {
    q: "Why does the AI Advisor sometimes say it's unavailable?",
    a: "It relies on an external AI provider. If none are configured on this server, or all of them are temporarily down, you'll see a message explaining which. Every other part of Bahi — Transactions, Invoices, reports, calculators, Business Profile — works independently of the AI Advisor.",
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
