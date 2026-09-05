import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { CSS } from "./styles";
import { setUnauthorizedHandler, TOKEN_KEY, apiGet, apiPost, getDarkMode, applyDarkMode } from "./utils";
import { TABS } from "./constants";
import { NAV_ICONS, IconHelp, IconTheme, IconBell } from "./Icons";
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
const Reports = lazy(() => import("./components/Reports"));

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
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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
    const initial = getDarkMode();
    setDarkMode(initial);
    applyDarkMode(initial);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const next = !darkMode;
    setDarkMode(next);
    applyDarkMode(next);
  }, [darkMode]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const rows = await apiGet("/notifications");
      setNotifications(rows);
    } catch {
      // ignore — notifications are non-critical
    }
  }, [user]);

  const markAllRead = useCallback(async () => {
    try {
      await apiPost("/notifications/read", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  }, []);

  const markNotifRead = useCallback(async (id) => {
    try {
      await apiPost(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {
      // ignore
    }
  }, []);

  const openNotif = useCallback((n) => {
    if (!n.isRead) markNotifRead(n.id);
    if (n.link?.startsWith("/invoices")) setTab("invoices");
    setNotifOpen(false);
  }, [markNotifRead]);

  useEffect(() => {
    if (!user) return;
    loadNotifications();
    const id = setInterval(loadNotifications, 30000);
    return () => clearInterval(id);
  }, [user, loadNotifications]);

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

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".notif-wrap")) setNotifOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

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
            <div className="tag">ur personal CA</div>
            <div className="tag" style={{ marginTop: 2 }}>AI-assisted bookkeeping · Free to use</div>
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
          <div className="themebtn">
            <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
              <IconTheme dark={darkMode} className="navicon" />
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
          </div>
          {deferredPrompt && (
            <div className="helpbtn">
              <button
                onClick={async () => {
                  deferredPrompt.prompt();
                  const choice = await deferredPrompt.userChoice;
                  setDeferredPrompt(null);
                }}
                aria-label="Install Bahi"
              >
                <IconBell className="navicon" />
                Install app
              </button>
            </div>
          )}
          <div className="helpbtn" style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }}
              aria-label="Notifications"
              className="notif-wrap"
            >
              <span className={`notif-bell ${notifications.some((n) => !n.isRead) ? "has-unread" : ""}`} onClick={(e) => e.stopPropagation()}>
                <IconBell className="navicon" />
              </span>
              {notifOpen && (
                <div className="notif-dropdown">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.isRead ? "unread" : ""}`}
                        onClick={() => openNotif(n)}
                      >
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-time">{new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                      </div>
                    ))
                  )}
                  {notifications.some((n) => !n.isRead) && (
                    <div style={{ padding: "8px 12px", textAlign: "center", borderTop: "1px solid var(--rule)" }}>
                      <button className="btn ghost sm" onClick={(e) => { e.stopPropagation(); markAllRead(); }}>Mark all read</button>
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
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
                {tab === "reports" && <Reports txns={txns} invoices={invoices} />}
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
