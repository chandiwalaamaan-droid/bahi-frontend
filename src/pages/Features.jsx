import React, { useEffect, useState } from "react";
import { CSS } from "../styles";
import { getDarkMode, applyDarkMode } from "../utils";
import {
  IconDashboard, IconTransactions, IconInvoice, IconReport, IconCalculator,
  IconPercent, IconAdvisor, IconBuilding,
} from "../Icons";
import { Reveal, LandingNav, LandingFooter } from "../components/LandingChrome";

const FEATURE_DETAILS = [
  {
    Icon: IconDashboard,
    title: "Dashboard",
    desc: "Business Health — the key numbers for your practice, for this month, the moment you sign in.",
    bullets: [
      <>Income, expenses, and net at a glance for the current month</>,
      <>Estimated tax liability, so filing time doesn't bring a surprise</>,
      <>A running read on whether you're trending ahead or behind last month</>,
    ],
  },
  {
    Icon: IconTransactions,
    title: "Transactions",
    desc: "Log every rupee in and out, categorised and searchable — the base every report and calculator builds on.",
    bullets: [
      <>Income and expense categories built for freelancers and small businesses — client payments, salaries, rent, software, travel, and more</>,
      <>Filter and search your history, then export everything as a <b>CSV</b> whenever you need it</>,
      <>Every dashboard stat and report recalculates the instant you add one</>,
    ],
  },
  {
    Icon: IconInvoice,
    title: "Invoices & recurring invoices",
    desc: "Create professional, GST-ready invoices in minutes, and set up templates that generate themselves on a schedule.",
    bullets: [
      <><b>CGST/SGST or IGST</b> calculated automatically from your business profile</>,
      <>Credit notes for corrections, clearly badged so nothing gets double-counted</>,
      <>Recurring templates that generate new invoices <b>monthly, quarterly, or yearly</b> without you lifting a finger</>,
    ],
  },
  {
    Icon: IconReport,
    title: "Reports & Insights",
    desc: "Profit & loss, cash flow, GST summary, and trend charts for your books — updated live as you add transactions.",
    bullets: [
      <><b>Profit &amp; Loss</b> and <b>Cash Flow</b> statements for any period</>,
      <><b>GST Summary</b> — output tax collected, input tax paid, and net GST payable, split by rate</>,
      <>12-month trend charts plus a category breakdown of where money is actually going</>,
    ],
  },
  {
    Icon: IconCalculator,
    title: "Tax Calculator",
    desc: "Compare the old and new income-tax regimes side by side, using current FY 2025–26 (AY 2026–27) slab rates.",
    bullets: [
      <>See your exact tax under both regimes, and which one wins for your numbers</>,
      <>Deductions under <b>80C, 80D, and 80CCD</b> factored into the old-regime side</>,
      <>No sign-in required — open it straight from the sign-in screen</>,
    ],
  },
  {
    Icon: IconPercent,
    title: "GST Calculator",
    desc: "Work out GST-inclusive or exclusive amounts, split correctly by CGST/SGST or IGST.",
    bullets: [
      <>Toggle between inclusive and exclusive calculations instantly</>,
      <>Automatic <b>CGST/SGST vs IGST</b> split for intra- or inter-state supply</>,
      <>Free to use without an account, just like the Tax Calculator</>,
    ],
  },
  {
    Icon: IconAdvisor,
    title: "AI Advisor",
    desc: "Ask about GST, income tax, deductions, or anything in your own books — in plain English.",
    bullets: [
      <>Answers grounded in a snapshot of your actual transactions and invoices, not generic guesses</>,
      <>Edit or regenerate any answer that doesn't quite land</>,
      <>A planning tool, not a substitute for a Chartered Accountant — always confirm anything consequential before filing</>,
    ],
  },
  {
    Icon: IconBuilding,
    title: "Business Profile",
    desc: "Store your business details once so every invoice and calculation uses the right numbers automatically.",
    bullets: [
      <><b>GSTIN, PAN, address,</b> and contact details reused across every invoice</>,
      <>Powers the CGST/SGST vs IGST split on invoices and the GST calculator</>,
      <>Update it any time — every new invoice picks up the latest details</>,
    ],
  },
];

export default function Features({ onGetStarted, onSignIn, onHome }) {
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
        active="features"
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        onHome={onHome}
        onFeatures={() => {}}
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
      />

      <section className="landing-hero" style={{ paddingBottom: 8 }}>
        <div className="landing-wrap" style={{ maxWidth: 720, textAlign: "center", margin: "0 auto" }}>
          <span className="landing-eyebrow">Features</span>
          <h1 style={{ fontSize: 38 }}>Everything you need to run your books</h1>
          <p className="lede" style={{ margin: "18px auto 0 auto" }}>
            Eight tools, one ledger. Every number you see here is fed by the same transactions and
            invoices, so nothing needs re-entering twice.
          </p>
          <div className="landing-cta-row" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={onGetStarted}>Get started free →</button>
          </div>
        </div>
      </section>

      <Reveal className="landing-section">
        <div className="landing-wrap" style={{ maxWidth: 820 }}>
          {FEATURE_DETAILS.map((f) => (
            <div className="landing-feature-detail" key={f.title}>
              <span className="landing-icon-badge"><f.Icon /></span>
              <div>
                <h3>{f.title}</h3>
                <p className="desc">{f.desc}</p>
                <ul>
                  {f.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="landing-section">
        <div className="landing-wrap">
          <div className="landing-cta-band">
            <h2>Ready to see your numbers sorted?</h2>
            <p>Free to use — no card, no trial countdown.</p>
            <button className="btn" onClick={onGetStarted}>Get started free →</button>
          </div>
        </div>
      </Reveal>

      <LandingFooter onFeatures={() => {}} />
    </div>
  );
}
