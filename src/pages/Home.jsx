import React, { useEffect, useState } from "react";
import { CSS } from "../styles";
import { getDarkMode, applyDarkMode } from "../utils";
import {
  IconDashboard, IconTransactions, IconInvoice, IconReport, IconCalculator,
  IconPercent, IconAdvisor, IconBuilding, IconCheck, IconShield, IconDownload,
} from "../Icons";
import { Reveal, LandingNav, LandingFooter } from "../components/LandingChrome";

const FEATURES = [
  { Icon: IconDashboard, title: "Dashboard", desc: "Income, expenses, and net for the month, plus your estimated tax liability — at a glance." },
  { Icon: IconTransactions, title: "Transactions", desc: "Log income and expenses by category. Every report and calculator recalculates the moment you add one." },
  { Icon: IconInvoice, title: "Invoices & recurring", desc: "GST-ready invoices in minutes, plus templates that generate themselves monthly, quarterly, or yearly." },
  { Icon: IconReport, title: "Reports & Insights", desc: "Profit & loss, cash flow, GST summary, and 12-month trend charts for your books." },
  { Icon: IconCalculator, title: "Tax Calculator", desc: "Old vs new income-tax regime, compared side by side with current FY slab rates." },
  { Icon: IconPercent, title: "GST Calculator", desc: "Inclusive or exclusive GST amounts, split correctly by CGST/SGST or IGST." },
  { Icon: IconAdvisor, title: "AI Advisor", desc: "Ask about GST, income tax, deductions, or anything in your own books, in plain English." },
  { Icon: IconBuilding, title: "Business Profile", desc: "GSTIN, PAN, and address saved once, reused on every invoice and calculation." },
];

const STEPS = [
  { num: "01", title: "Add your transactions", desc: "Log income and expenses as they happen, sorted into categories built for freelancers and small businesses." },
  { num: "02", title: "Send GST-ready invoices", desc: "Fill in an invoice and Bahi works out CGST/SGST or IGST automatically from your business profile." },
  { num: "03", title: "Watch your reports update", desc: "Profit & loss, cash flow, and GST summary recalculate the moment you add a transaction." },
  { num: "04", title: "Ask the AI Advisor", desc: "Get a plain-English answer about your GST, deductions, or what a number on your dashboard actually means." },
];

const FAQS = [
  { q: "Is Bahi actually free?", a: "Yes — transactions, invoices, reports, the AI Advisor, and both calculators are free to use." },
  { q: "Do I need an account for the Tax and GST calculators?", a: "No. You can open both straight from the sign-in screen without creating an account — they run entirely in your browser. Sign in only if you want your numbers saved and a personalized dashboard." },
  { q: "Is the AI Advisor a substitute for a Chartered Accountant?", a: "No. It's a planning tool for plain-English answers about GST, income tax, and your own numbers. Always confirm anything consequential — filings, notices, large transactions — with a qualified CA before acting on it." },
  { q: "What happens to my password and data?", a: "Passwords are hashed, never stored in plain text, and sessions are authenticated with signed tokens. You can export everything you've logged as a CSV file at any time from the Transactions tab." },
  { q: "Can I install Bahi like an app?", a: "Yes — Bahi is an installable web app. Once signed in, use the \"Install app\" option in the sidebar to add it to your home screen or desktop." },
];

export default function Home({ onGetStarted, onSignIn, onViewFeatures }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const initial = getDarkMode();
    setDarkMode(initial);
    applyDarkMode(initial);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    applyDarkMode(next);
  };

  return (
    <div className="bahi landing">
      <style>{CSS}</style>

      <LandingNav
        active="home"
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        onHome={() => {}}
        onFeatures={onViewFeatures}
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
      />

      <section className="landing-hero">
        <div className="landing-wrap landing-hero-grid">
          <div>
            <span className="landing-eyebrow">Free · AI-assisted bookkeeping</span>
            <h1>Run your books like you've got a CA on call — <span className="accent">for free</span></h1>
            <p className="lede">
              Track income and expenses, send GST-ready invoices, and get plain-English answers on tax
              and GST — all in one ledger built for freelancers, students, and small businesses in India.
            </p>
            <div className="landing-cta-row">
              <button className="btn" onClick={onGetStarted}>Get started free →</button>
              <button className="btn ghost" onClick={onViewFeatures}>See what's inside</button>
            </div>
            <p className="landing-cta-note">No credit card. Sign in with Google or email in seconds.</p>
            <div className="landing-trust-row">
              <span className="item"><IconCheck /> Free to use</span>
              <span className="item"><IconShield /> Your numbers stay yours</span>
              <span className="item"><IconCheck /> Google or email sign-in</span>
            </div>
          </div>

          <div className="landing-mock" aria-hidden="true">
            <div className="landing-mock-head">
              <span className="mock-title">Business Health · This month</span>
              <span className="pill green">On track</span>
            </div>
            <div className="row">
              <div className="stat pos"><div className="lbl">Income</div><div className="val">₹1,84,000</div></div>
              <div className="stat neg"><div className="lbl">Expenses</div><div className="val">₹62,400</div></div>
              <div className="stat"><div className="lbl">Net</div><div className="val">₹1,21,600</div></div>
            </div>
            <div className="landing-mock-list">
              <div className="landing-mock-row">
                <div><div className="name">Client payment — Acme Co.</div><div className="cat">Income</div></div>
                <div className="amt pos">+₹45,000</div>
              </div>
              <div className="landing-mock-row">
                <div><div className="name">Software subscription</div><div className="cat">Expense</div></div>
                <div className="amt neg">−₹2,499</div>
              </div>
              <div className="landing-mock-row">
                <div><div className="name">Invoice #INV-0042 sent</div><div className="cat">GST · 18%</div></div>
                <div className="amt pos">+₹28,320</div>
              </div>
            </div>
            <p className="landing-mock-caption">Illustrative preview — not real data</p>
          </div>
        </div>
      </section>

      <div className="landing-differentiator">
        <div className="landing-wrap">
          <IconShield />
          <p>
            <strong>Why not just a spreadsheet or a one-off chat?</strong> A spreadsheet doesn't work out your
            GST split or slab-wise tax for you, and a chat window doesn't remember last month's invoices.
            Bahi keeps every transaction, invoice, and calculation in one ledger — recalculated automatically,
            every time.
          </p>
        </div>
      </div>

      <Reveal className="landing-section">
        <div className="landing-wrap">
          <div className="landing-section-head">
            <span className="landing-eyebrow">What's inside</span>
            <h2>Everything a solo business needs, in one ledger</h2>
            <p>Eight tools that share the same numbers, so nothing ever falls out of sync.</p>
          </div>
          <div className="landing-feature-grid">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div className="landing-feature-card" key={title}>
                <span className="landing-icon-badge"><Icon /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="landing-section">
        <div className="landing-wrap">
          <div className="landing-section-head">
            <span className="landing-eyebrow">How it works</span>
            <h2>Four steps, free to start</h2>
          </div>
          <div className="landing-steps">
            {STEPS.map((s) => (
              <div className="landing-step" key={s.num}>
                <span className="num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="landing-section tight">
        <div className="landing-wrap">
          <div className="landing-trust-badges">
            <div className="landing-trust-badge"><IconShield /><span>Passwords hashed, sessions signed</span></div>
            <div className="landing-trust-badge"><IconDownload /><span>Export everything as CSV, anytime</span></div>
            <div className="landing-trust-badge"><IconCheck /><span>Delete your account and data on request</span></div>
            <div className="landing-trust-badge"><IconShield /><span>Read the full <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a></span></div>
          </div>
        </div>
      </Reveal>

      <Reveal className="landing-section">
        <div className="landing-wrap">
          <div className="landing-section-head">
            <span className="landing-eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </div>
          <div className="landing-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="landing-section">
        <div className="landing-wrap">
          <div className="landing-cta-band">
            <h2>Open your ledger in under a minute</h2>
            <p>Free to use — no card, no trial countdown.</p>
            <button className="btn" onClick={onGetStarted}>Get started free →</button>
          </div>
        </div>
      </Reveal>

      <LandingFooter onFeatures={onViewFeatures} />
    </div>
  );
}
