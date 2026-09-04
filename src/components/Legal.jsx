import React, { useState, useEffect } from "react";

// Same optional env var Support.jsx uses — if it's set we show a real contact
// address in these documents instead of a placeholder.
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;
const CONTACT_LINE = SUPPORT_EMAIL || "[contact email — set VITE_SUPPORT_EMAIL]";

// NOTE FOR WHOEVER RUNS THIS: the bracketed placeholders below ([Entity Name],
// [State/Country], [Effective Date]) need to be filled in with real details
// before this is relied on as a binding legal document. This text is a
// reasonable starting point, not a substitute for review by a lawyer
// qualified in your jurisdiction.
const EFFECTIVE_DATE = "[Effective Date — fill in]";
const ENTITY_NAME = "[Entity/Operator Name — fill in]";
const GOVERNING_LAW = "[State/Country of jurisdiction — fill in, e.g. India]";

const TERMS_SECTIONS = [
  {
    h: "1. Acceptance of these Terms",
    p: [
      `These Terms of Service ("Terms") govern your use of Bahi (the "Service"), operated by ${ENTITY_NAME} ("we", "us", "our"). By creating an account or using Bahi, you agree to these Terms. If you don't agree, please don't use the Service.`,
    ],
  },
  {
    h: "2. What Bahi is — and isn't",
    p: [
      "Bahi is a bookkeeping and invoicing tool aimed at freelancers, students, and small businesses in India. It includes transaction and invoice tracking, an income-tax and GST calculator, and an AI Advisor that can answer questions in plain language.",
      "Bahi is not a chartered accountant, tax advisor, or law firm, and nothing in the app — including the AI Advisor, the Dashboard's estimated tax liability, or the Tax/GST calculators — is professional financial, tax, accounting, or legal advice. These are simplified planning tools. Always confirm anything consequential (filings, large transactions, notices from a tax authority) with a qualified Chartered Accountant before acting on it.",
    ],
  },
  {
    h: "3. Accounts",
    p: [
      "You can create an account with an email and password, or sign in with Google. You're responsible for keeping your credentials secure and for all activity under your account. Tell us if you believe your account has been compromised.",
      "You must provide accurate information and be legally able to enter into these Terms. Bahi isn't directed at children, and you must be at least 18 (or the age of majority where you live) to create an account.",
    ],
  },
  {
    h: "4. Your data and content",
    p: [
      "You own the transactions, invoices, business profile details, and any other content you enter into Bahi (\"Your Content\"). You give us a limited license to store, process, and display Your Content solely to operate and improve the Service for you.",
      "You're responsible for the accuracy of Your Content. Bahi does not verify GSTIN, PAN, or other details you enter, and invoices you generate are only as accurate as the information you provide.",
    ],
  },
  {
    h: "5. The AI Advisor",
    p: [
      "The AI Advisor is powered by third-party AI providers. When you ask it about your own numbers, a snapshot of your recent transactions and invoices is sent to the configured provider to answer that question. AI-generated responses can be incomplete or wrong, and should be treated as a starting point for your own research — not a filing-ready answer.",
      "If no AI provider is configured on the server you're using, or all configured providers are temporarily unavailable, the AI Advisor may be unavailable. Every other part of Bahi works independently of it.",
    ],
  },
  {
    h: "6. Acceptable use",
    p: [
      "Don't use Bahi to break the law, to submit false or fraudulent tax filings, to attack or overload the Service, to reverse-engineer or scrape it, or to access another user's account or data without authorization.",
    ],
  },
  {
    h: "7. Third-party services",
    p: [
      "Bahi relies on third-party services to operate: Google (for optional sign-in), an email delivery provider (for password-reset emails), and one or more AI providers (for the AI Advisor). Your use of those features is also subject to those providers' own terms.",
    ],
  },
  {
    h: "8. Cost of the Service",
    p: [
      "Bahi is currently free to use, with no paid tier. We may change this in the future; if we do, we'll give existing users reasonable notice before any part of the Service that was free starts requiring payment.",
    ],
  },
  {
    h: "9. Termination",
    p: [
      "You can stop using Bahi and ask us to delete your account at any time. We may suspend or terminate accounts that violate these Terms, or discontinue the Service, with notice where reasonably possible.",
    ],
  },
  {
    h: "10. Disclaimer of warranties",
    p: [
      'The Service is provided "as is" and "as available," without warranties of any kind, express or implied, including accuracy, reliability, or fitness for a particular purpose. We don\'t guarantee the Service will be uninterrupted, error-free, or that calculations will match your actual tax liability.',
    ],
  },
  {
    h: "11. Limitation of liability",
    p: [
      `To the maximum extent permitted by law, ${ENTITY_NAME} will not be liable for indirect, incidental, or consequential damages arising from your use of the Service, including any tax penalty, filing error, or financial loss resulting from reliance on figures produced by Bahi.`,
    ],
  },
  {
    h: "12. Changes to these Terms",
    p: [
      "We may update these Terms from time to time. If we make material changes, we'll make a reasonable effort to notify you (e.g. in-app). Continuing to use Bahi after changes take effect means you accept the updated Terms.",
    ],
  },
  {
    h: "13. Governing law",
    p: [
      `These Terms are governed by the laws of ${GOVERNING_LAW}, without regard to conflict-of-law principles.`,
    ],
  },
  {
    h: "14. Contact",
    p: [`Questions about these Terms? Reach us at ${CONTACT_LINE}.`],
  },
];

const PRIVACY_SECTIONS = [
  {
    h: "1. What this covers",
    p: [
      `This Privacy Policy explains what data Bahi (operated by ${ENTITY_NAME}) collects, how it's used, and the choices you have. It applies to the Bahi web app.`,
    ],
  },
  {
    h: "2. What we collect",
    p: [
      "Account data: your email address, name (optional), and a securely hashed password — or, if you sign in with Google, the name, email, and profile info Google shares with us.",
      "Business data you enter: business name, GSTIN, PAN, address, phone, and business email in your Business Profile; every transaction and invoice you log or create; and your message history with the AI Advisor.",
      "We don't collect payment details — Bahi has no paid tier today.",
    ],
  },
  {
    h: "3. How we use it",
    p: [
      "To run the Service: storing and displaying your transactions, invoices, and profile; generating your Dashboard and tax/GST calculations; authenticating you.",
      "To answer AI Advisor questions: when you ask about your own numbers, a snapshot of your recent transactions and invoices is sent to the configured third-party AI provider (currently Google Gemini and/or Groq, depending on server configuration) to generate a response. That snapshot is used to answer your question and is subject to that provider's own data-handling terms.",
      "To send account emails: password-reset links are sent via our email delivery provider (currently Resend) when you request one.",
    ],
  },
  {
    h: "4. Who we share data with",
    p: [
      "We don't sell your data. We share it only with the service providers needed to run Bahi: Google (if you use Google Sign-In), our AI providers (only for AI Advisor queries you initiate, and only the snapshot needed to answer them), our email delivery provider (only for transactional emails like password resets), and our database/hosting provider, who stores the data on our behalf.",
      "We may also disclose data if required by law or to protect the security of the Service.",
    ],
  },
  {
    h: "5. Storage and security",
    p: [
      "Your data is stored in a database accessible only to your account when you're logged in. Passwords are hashed (never stored in plain text) and sessions are authenticated with signed tokens. No method of storage or transmission is 100% secure, but we take reasonable steps to protect your data.",
    ],
  },
  {
    h: "6. Local storage",
    p: [
      "Your browser stores your login session token locally so you don't have to sign in every visit, along with a small flag remembering whether you've seen the onboarding guide. Signing out clears the session token.",
    ],
  },
  {
    h: "7. Data retention and deletion",
    p: [
      "We keep your data as long as your account is active. You can export everything you've logged as a CSV file at any time from the Transactions tab. To delete your account and associated data, contact us and we'll process the request within a reasonable time.",
    ],
  },
  {
    h: "8. Your rights",
    p: [
      "Depending on where you live, you may have rights to access, correct, export, or delete your personal data, and to object to certain processing. To exercise any of these, contact us using the details below.",
    ],
  },
  {
    h: "9. Children's privacy",
    p: [
      "Bahi isn't directed at children and isn't intended for use by anyone under 18. We don't knowingly collect data from children.",
    ],
  },
  {
    h: "10. Changes to this policy",
    p: [
      "We may update this Privacy Policy from time to time. Material changes will be flagged in-app. Continuing to use Bahi after changes take effect means you accept the updated policy.",
    ],
  },
  {
    h: "11. Contact",
    p: [`Questions about this policy, or a data request? Reach us at ${CONTACT_LINE}.`],
  },
];

function Section({ h, p }) {
  return (
    <div className="guide-term" style={{ marginBottom: 18 }}>
      <dt style={{ marginBottom: 4 }}>{h}</dt>
      {p.map((line, i) => (
        <dd key={i} style={{ marginTop: i === 0 ? 2 : 8 }}>
          {line}
        </dd>
      ))}
    </div>
  );
}

export default function Legal({ onClose, initialTab = "terms" }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sections = tab === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <div className="guide-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" style={{ maxWidth: 700 }}>
        <button className="guide-close" onClick={onClose} aria-label="Close">×</button>
        <h2 id="legal-title">{tab === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
        <p className="guide-intro" style={{ marginBottom: 14 }}>
          Effective {EFFECTIVE_DATE}. Plain-language summary — the sections below are the full text.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button
            className="btn"
            onClick={() => setTab("terms")}
            style={tab !== "terms" ? { background: "transparent", color: "var(--primary)", border: "1px solid var(--rule)" } : undefined}
          >
            Terms of Service
          </button>
          <button
            className="btn"
            onClick={() => setTab("privacy")}
            style={tab !== "privacy" ? { background: "transparent", color: "var(--primary)", border: "1px solid var(--rule)" } : undefined}
          >
            Privacy Policy
          </button>
        </div>

        <div className="guide-glossary" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
          <dl>
            {sections.map((s) => (
              <Section key={s.h} h={s.h} p={s.p} />
            ))}
          </dl>
        </div>

        <div className="guide-footer">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
