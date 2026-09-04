import React, { useState, useEffect, useCallback } from "react";
import { CSS } from "./styles";
import { setUnauthorizedHandler, TOKEN_KEY, apiGet } from "./utils";
import { TABS } from "./constants";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Invoices from "./components/Invoices";
import TaxCalculator from "./components/TaxCalculator";
import GstCalculator from "./components/GstCalculator";
import Advisor from "./components/Advisor";
import BusinessProfile from "./components/BusinessProfile";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tab, setTab] = useState("dashboard");
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
            <div className="mark">Bahi</div>
            <div className="tag">Your AI chartered accountant</div>
          </div>
          <nav>
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="logout">
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>{user.email}</div>
            <button onClick={logout}>Sign out</button>
          </div>
        </aside>
        <main className="main">
          {error && <div className="banner-error">{error}</div>}
          {!loaded ? (
            <p className="empty">Opening the ledger…</p>
          ) : (
            <>
              {tab === "dashboard" && <Dashboard txns={txns} invoices={invoices} />}
              {tab === "transactions" && <Transactions txns={txns} setTxns={setTxns} setError={setError} />}
              {tab === "invoices" && <Invoices invoices={invoices} setInvoices={setInvoices} setError={setError} profile={profile} />}
              {tab === "tax" && <TaxCalculator />}
              {tab === "gst" && <GstCalculator />}
              {tab === "advisor" && <Advisor chat={chat} setChat={setChat} />}
              {tab === "settings" && <BusinessProfile profile={profile} setProfile={setProfile} setError={setError} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
