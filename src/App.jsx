import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { CSS } from "./styles";
import { setUnauthorizedHandler, TOKEN_KEY, apiGet } from "./utils";
import { TABS } from "./constants";
import { NAV_ICONS, IconHelp } from "./Icons";
import AuthScreen from "./components/AuthScreen";
import Transactions from "./components/Transactions";
import TaxCalculator from "./components/TaxCalculator";
import GstCalculator from "./components/GstCalculator";
import BusinessProfile from "./components/BusinessProfile";
import Guide from "./components/Guide";
import Support from "./components/Support";

// Split out the two heaviest tabs (recharts + react-markdown/remark-gfm)
// so the initial bundle doesn't pay for them until the user opens that tab.
const Dashboard = lazy(() => import("./components/Dashboard"));
const Advisor = lazy(() => import("./components/Advisor"));
const Invoices = lazy(() => import("./components/Invoices"));

const TabFallback = () => <p className="empty">Loading…</p>;

const GUIDE_SEEN_KEY = "bahi_guide_seen";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [showGuide, setShowGuide] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [txns, setTxns] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [chat, setChat] = useState([]);
  const [profile, setProfile] = useState({ business_name: "", gstin: "", pan: "", address: "", phone: "", email: "" });
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setTxns([]);
    setInvoices([]);
    setChat([]);
    setLoaded(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setCheckingSession(false);
        return;
      }
      try {
        const me = await apiGet("/auth/me");
        setUser(me);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!localStorage.getItem(GUIDE_SEEN_KEY)) {
      setShowGuide(true);
      localStorage.setItem(GUIDE_SEEN_KEY, "1");
    }
  }, [user]);

  const closeGuide = useCallback(() => setShowGuide(false), []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoaded(false);
      setError("");
      try {
        const [t, inv, c, p] = await Promise.all([
          apiGet("/transactions"),
          apiGet("/invoices"),
          apiGet("/chat"),
          apiGet("/business-profile"),
        ]);
        setTxns(t);
        setInvoices(inv);
        setChat(c);
        setProfile(p);
      } catch (e) {
        setError(e.message || "Could not connect to backend. Make sure the server is running.");
        console.error(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, [user]);

  if (checkingSession) {
    return (
      <div className="bahi">
        <style>{CSS}</style>
        <div className="auth-wrap"><p className="empty">Opening the ledger…</p></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthed={setUser} />;
  }

  return (
    <div className="bahi">
      <style>{CSS}</style>
      <div className="shell">
        <aside className="side">
          <div className="brand">
            <div className="mark" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/logo.png" alt="" width={26} height={26} style={{ borderRadius: 6 }} />
              Bahi
            </div>
            <div className="tag">AI-assisted bookkeeping — not a licensed CA</div>
            <div className="tag" style={{ marginTop: 2 }}>Free to use</div>
          </div>
          <nav>
            {TABS.map((t) => {
              const Icon = NAV_ICONS[t.id];
              return (
                <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
                  {Icon && <Icon className="navicon" />}
                  {t.label}
                </button>
              );
            })}
          </nav>
          <div className="helpbtn">
            <button onClick={() => setShowGuide(true)}>
              <IconHelp className="navicon" />
              Guide
            </button>
          </div>
          <div className="helpbtn">
            <button onClick={() => setShowSupport(true)}>
              <IconHelp className="navicon" />
              FAQ &amp; Support
            </button>
          </div>
          <div className="logout">
            <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 10 }}>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="link-btn" style={{ textDecoration: "underline" }}>Terms</a>
              <span style={{ margin: "0 5px" }}>·</span>
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link-btn" style={{ textDecoration: "underline" }}>Privacy</a>
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>{user.email}</div>
            <button onClick={logout}>Sign out</button>
          </div>
        </aside>
        <main className="main">
          {error && <div className="banner-error">{error}</div>}
          {!loaded ? (
            <p className="empty">Opening the ledger…</p>
          ) : (
            <Suspense fallback={<TabFallback />}>
              {tab === "dashboard" && <Dashboard txns={txns} invoices={invoices} />}
              {tab === "transactions" && <Transactions txns={txns} setTxns={setTxns} setError={setError} />}
              {tab === "invoices" && <Invoices invoices={invoices} setInvoices={setInvoices} setError={setError} profile={profile} />}
              {tab === "tax" && <TaxCalculator />}
              {tab === "gst" && <GstCalculator />}
              {tab === "advisor" && <Advisor chat={chat} setChat={setChat} />}
              {tab === "settings" && <BusinessProfile profile={profile} setProfile={setProfile} setError={setError} />}
            </Suspense>
          )}
        </main>
      </div>
      {showGuide && <Guide onClose={closeGuide} />}
      {showSupport && <Support onClose={() => setShowSupport(false)} />}
    </div>
  );
}
