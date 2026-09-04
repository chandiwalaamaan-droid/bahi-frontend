import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSS } from "../styles";
import { apiAuth, TOKEN_KEY } from "../utils";
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
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
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
              <div className="mark" style={{ fontFamily: "'Source Serif 4',serif", fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>Bahi</div>
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
          <div className="mark">Bahi</div>
          <div className="tag">Simple books for freelancers &amp; students — no accounting degree needed. Free to use.</div>

          {(mode === "login" || mode === "register") && GOOGLE_CLIENT_ID && (
            <div style={{ marginBottom: 16 }}>
              <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center" }} />
              {googleError && <div className="auth-error">{googleError}</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
                <span style={{ fontSize: 12, color: "var(--slate)" }}>or use email</span>
                <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
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
              {error && <div className="auth-error">{error}</div>}
              <button className="btn" type="submit" disabled={busy}>
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
        </div>
      </div>
    </div>
  );
}
