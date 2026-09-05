import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSS } from "../styles";
import { apiAuth, TOKEN_KEY, getDarkMode } from "../utils";
import TaxCalculator from "./TaxCalculator";
import GstCalculator from "./GstCalculator";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AuthScreen({ onAuthed }) {
  // modes: "login" | "register" | "forgot" | "reset" | "calculators"
  const [mode, setMode] = useState("login");
  const [googleError, setGoogleError] = useState("");
  const googleBtnRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // If the user arrived via a password-reset email link (?resetToken=...),
  // jump straight into the reset-password form.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("resetToken");
    if (token) {
      setResetToken(token);
      setMode("reset");
      // Clean the token out of the visible URL/browser history.
      params.delete("resetToken");
      const rest = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""));
    }
  }, []);

  const handleGoogleCredential = useCallback(
    async (response) => {
      setGoogleError("");
      setError("");
      try {
        const data = await apiAuth("/google", { credential: response.credential });
        localStorage.setItem(TOKEN_KEY, data.token);
        onAuthed(data.user);
      } catch (err) {
        setGoogleError(err.message || "Google sign-in failed.");
      }
    },
    [onAuthed]
  );

  // Render the "Sign in with Google" button whenever we're on the login or
  // register screen. The GIS script tag loads async, so poll briefly for it
  // instead of assuming it's ready on mount.
  useEffect(() => {
    if (mode !== "login" && mode !== "register") return;
    if (!GOOGLE_CLIENT_ID) return;

    let cancelled = false;
    let attempts = 0;
    const tryRender = () => {
      if (cancelled) return;
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        googleBtnRef.current.innerHTML = "";
        // Google's button takes a fixed pixel width, not a percentage, so a
        // hardcoded value (e.g. 320) overflows the card on narrow phones.
        // Measure the actual container instead and clamp it to a sane range.
        const measuredWidth = Math.round(googleBtnRef.current.getBoundingClientRect().width) || 320;
        // Match the button's theme to light/dark mode so it blends into the
        // card instead of sitting there as a stark white box.
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: getDarkMode() ? "filled_black" : "outline",
          shape: "pill",
          size: "large",
          width: Math.min(Math.max(measuredWidth, 200), 400),
          text: mode === "register" ? "signup_with" : "signin_with",
        });
        return;
      }
      attempts += 1;
      if (attempts < 40) setTimeout(tryRender, 150); // poll up to ~6s for the script to load
    };
    tryRender();

    return () => {
      cancelled = true;
    };
  }, [mode, handleGoogleCredential]);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
  };

  const submitLoginOrRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (mode === "register" && !agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    setBusy(true);
    try {
      const path = mode === "login" ? "/login" : "/register";
      const body = mode === "login" ? { email, password } : { email, password, name };
      const data = await apiAuth(path, body);
      localStorage.setItem(TOKEN_KEY, data.token);
      onAuthed(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const data = await apiAuth("/forgot-password", { email });
      setInfo(data.message || "If that email is registered, we've sent a password reset link.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const data = await apiAuth("/reset-password", { token: resetToken, password });
      setInfo(data.message || "Password updated. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => switchMode("login"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (mode === "calculators") {
    return (
      <div className="bahi">
        <style>{CSS}</style>
        <div className="auth-wrap">
          <div style={{ width: "100%", maxWidth: 720 }}>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div className="mark" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'Source Serif 4',serif", fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>
                <img src="/logo.png" alt="" width={36} height={36} style={{ borderRadius: 8 }} />
                Bahi
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>
                Free to use, no account needed — these run entirely in your browser.
                Sign in if you'd like your numbers saved and a personalized dashboard.
              </p>
            </div>
            <TaxCalculator />
            <GstCalculator />
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button className="link-btn" onClick={() => switchMode("login")}>← Back to sign in</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bahi">
      <style>{CSS}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-seal">
            <img src="/logo.png" alt="" width={32} height={32} style={{ borderRadius: 8 }} />
          </div>
          <div className="mark">Bahi</div>
          <div className="tag">ur personal CA — AI-assisted bookkeeping, free to use.</div>

          {(mode === "login" || mode === "register") && GOOGLE_CLIENT_ID && (
            <div style={{ marginBottom: 16 }}>
              <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center" }} />
              {googleError && <div className="auth-error">{googleError}</div>}
              <div className="auth-divider">
                <div className="line" />
                <span>or use email</span>
                <div className="dot" />
                <div className="line" />
              </div>
            </div>
          )}

          {(mode === "login" || mode === "register") && (
            <form onSubmit={submitLoginOrRegister}>
              {mode === "register" && (
                <div className="field">
                  <label>Name (optional)</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="field">
                <label>Password {mode === "register" && "(min 8 characters)"}</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "12px" }}>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => switchMode("forgot")}
                    style={{ fontSize: "0.9em" }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {mode === "register" && (
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "var(--slate)", margin: "4px 0 16px" }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="link-btn">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link-btn">Privacy Policy</a>.
                  </span>
                </label>
              )}
              {error && <div className="auth-error">{error}</div>}
              <button className="btn" type="submit" disabled={busy || (mode === "register" && !agreed)}>
                {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={submitForgot}>
              <p style={{ marginTop: 0 }}>
                Enter your account email and we'll send you a link to reset your password.
              </p>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              {info && <div className="auth-info">{info}</div>}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={submitReset}>
              <p style={{ marginTop: 0 }}>Choose a new password for your account.</p>
              <div className="field">
                <label>New password (min 8 characters)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              {info && <div className="auth-info">{info}</div>}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Reset password"}
              </button>
            </form>
          )}

          <div className="auth-switch">
            {mode === "login" && (
              <>
                New to Bahi? <button onClick={() => switchMode("register")}>Create an account</button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account? <button onClick={() => switchMode("login")}>Sign in</button>
              </>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <>
                Remembered it? <button onClick={() => switchMode("login")}>Back to sign in</button>
              </>
            )}
          </div>

          {(mode === "login" || mode === "register") && (
            <div className="auth-switch" style={{ marginTop: 8 }}>
              Just want the Tax/GST calculators?{" "}
              <button onClick={() => switchMode("calculators")}>Use them without an account</button>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: "var(--slate)" }}>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="link-btn">Terms of Service</a>
            <span style={{ margin: "0 6px" }}>·</span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link-btn">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
